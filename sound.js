let audioCtx = null;
let audioUnlocked = false;

const PENTATONIC_ROOTS = [261.63, 293.66, 329.63, 392.00, 440.00]; // C4 D4 E4 G4 A4
// root + sus4 + minor7th = 7sus4 voicing
const CHORD_SEMITONES = [0, 5, 10];
function semitoneRatio(n) { return Math.pow(2, n / 12); }

function initSoundEngine() {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    console.warn('Generating audio context is failed, visuals are working', e);
  }

  // first click - unlocking
  document.addEventListener('click', () => {
    if (!audioUnlocked && audioCtx) {
      audioCtx.resume().then(() => {
        audioUnlocked = true;
      });
    }
  });
}

// whenever hovered - slighly different but matched ambient harmonies are played 
function playSwoosh() {
  if (!audioCtx || !audioUnlocked) return;
  const now = audioCtx.currentTime;

  const delay = audioCtx.createDelay();
  delay.delayTime.setValueAtTime(0.09, now);
  const feedback = audioCtx.createGain();
  feedback.gain.setValueAtTime(0.35, now);
  const delayFilter = audioCtx.createBiquadFilter();
  delayFilter.type = 'lowpass';
  delayFilter.frequency.setValueAtTime(1200, now);
  delay.connect(feedback);
  feedback.connect(delayFilter);
  delayFilter.connect(delay);
  delay.connect(audioCtx.destination);

  const masterFilter = audioCtx.createBiquadFilter();
  masterFilter.type = 'lowpass';
  masterFilter.frequency.setValueAtTime(1600, now);
  masterFilter.connect(audioCtx.destination);
  masterFilter.connect(delay);

  [-6, 6].forEach((detuneCents) => {
    const drop = audioCtx.createOscillator();
    const dropGain = audioCtx.createGain();
    drop.type = 'sine';
    drop.detune.setValueAtTime(detuneCents, now);
    drop.frequency.setValueAtTime(1500, now);
    drop.frequency.exponentialRampToValueAtTime(320, now + 0.16);

    dropGain.gain.setValueAtTime(0.0001, now);
    dropGain.gain.exponentialRampToValueAtTime(0.06, now + 0.02);
    dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    drop.connect(dropGain);
    dropGain.connect(masterFilter);
    drop.start(now);
    drop.stop(now + 0.55);
  });

  const body = audioCtx.createOscillator();
  const bodyGain = audioCtx.createGain();
  body.type = 'sine';
  body.frequency.setValueAtTime(190, now + 0.02);

  bodyGain.gain.setValueAtTime(0.0001, now + 0.02);
  bodyGain.gain.exponentialRampToValueAtTime(0.03, now + 0.08);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

  body.connect(bodyGain);
  bodyGain.connect(masterFilter);
  body.start(now + 0.02);
  body.stop(now + 0.65);
}

// hovered -> sound played helper for every designated CSS components
// side bar menu, the tears are not for canvas but for DOM components

function attachHoverChime(selector, soundFn) {
  const fn = soundFn || playSwoosh; 
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener('mouseenter', () => fn());
  });
}

function makeDistortionCurve(amount) {
  const k = amount;
  const n = 44100;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((3 + k) * x * 20 * Math.PI / 180) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

function playMenuBlip() {
  if (!audioCtx || !audioUnlocked) return;
  const now = audioCtx.currentTime;

  const carrier = audioCtx.createOscillator();
  const modulator = audioCtx.createOscillator();
  carrier.type = 'sawtooth';
  modulator.type = 'square';
  carrier.frequency.setValueAtTime(589, now);
  modulator.frequency.setValueAtTime(202, now);

  const ringGain = audioCtx.createGain();
  ringGain.gain.setValueAtTime(0, now);
  carrier.connect(ringGain);
  modulator.connect(ringGain.gain);

  const shaper = audioCtx.createWaveShaper();
  shaper.curve = makeDistortionCurve(350);
  shaper.oversample = '4x';

  const cleanupFilter = audioCtx.createBiquadFilter();
  cleanupFilter.type = 'highpass';
  cleanupFilter.frequency.setValueAtTime(280, now);
  cleanupFilter.Q.setValueAtTime(0.5, now);

  const outGain = audioCtx.createGain();
  ringGain.connect(shaper);
  shaper.connect(cleanupFilter);
  cleanupFilter.connect(outGain);
  outGain.connect(audioCtx.destination);

  outGain.gain.setValueAtTime(0.0001, now);
  outGain.gain.exponentialRampToValueAtTime(0.1, now + 0.003);
  outGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

  carrier.start(now); carrier.stop(now + 0.07);
  modulator.start(now); modulator.stop(now + 0.07);

  const bufferSize = audioCtx.sampleRate * 0.01;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = audioCtx.createBufferSource();
  noise.buffer = noiseBuffer;
  const noiseHighpass = audioCtx.createBiquadFilter();
  noiseHighpass.type = 'highpass';
  noiseHighpass.frequency.setValueAtTime(3000, now);
  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.05, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.01);
  noise.connect(noiseHighpass);
  noiseHighpass.connect(noiseGain);
  noiseGain.connect(audioCtx.destination);
  noise.start(now);
  noise.stop(now + 0.012);
}

// when loaded, ready for sound engine
initSoundEngine();
