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
function attachHoverChime(selector) {
  const fn = soundFn || playSwoosh;
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener('mouseenter', () => playSwoosh());
  });
}

function playMenuBlip() {
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

// when loaded, ready for sound engine
initSoundEngine();
