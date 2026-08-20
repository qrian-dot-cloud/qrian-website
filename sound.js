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
      audioCtx.resume();
      audioUnlocked = true;
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
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener('mouseenter', () => playSwoosh());
  });
}

// when loaded, ready for sound engine
initSoundEngine();
