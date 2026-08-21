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
  const root = PENTATONIC_ROOTS[Math.floor(Math.random() * PENTATONIC_ROOTS.length)];

  CHORD_SEMITONES.forEach((semi, i) => {
    const detuneCents = (Math.random() - 0.5) * 8;
    const freq = root * semitoneRatio(semi) * Math.pow(2, detuneCents / 1200);

    const osc = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);
    filter.Q.setValueAtTime(0.3, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    const peakVol = 0.045 / CHORD_SEMITONES.length * (1 - i * 0.12);
    const attackTime = 0.6 + Math.random() * 0.4;
    const releaseTime = 1.8 + Math.random() * 0.8;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peakVol, now + attackTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + attackTime + releaseTime);

    osc.start(now);
    osc.stop(now + attackTime + releaseTime + 0.1);
    osc.onended = () => {
      osc.disconnect();
      filter.disconnect();
      gain.disconnect();
    };
  });
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
