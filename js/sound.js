let audioCtx = null;
let audioUnlocked = false;
let unlockPromise = null;

const MASTER_VOLUME = 1.25;
const PENTATONIC_ROOTS = [
  261.63,
  293.66,
  329.63,
  392.00,
  440.00
]; // C4 D4 E4 G4 A4

// root + sus4 + minor7th = 7sus4 voicing
const CHORD_SEMITONES = [0, 5, 10];

function semitoneRatio(n) {
  return Math.pow(2, n / 12);
}


// --------------------------------------------------
// AUDIO CONTEXT
// --------------------------------------------------

function getAudioContext() {
  if (audioCtx) return audioCtx;

  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      console.warn('Web Audio API is not supported.');
      return null;
    }

    audioCtx = new AudioContextClass();

  } catch (e) {
    console.warn(
      'Generating audio context failed, visuals are still working.',
      e
    );

    return null;
  }

  return audioCtx;
}


// tiny silent sound — helps iOS Safari initialise audio properly
function primeAudioContext() {
  if (!audioCtx) return;

  try {
    const buffer = audioCtx.createBuffer(
      1,
      1,
      audioCtx.sampleRate
    );

    const source = audioCtx.createBufferSource();

    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start(0);

  } catch (e) {
    // harmless fallback
  }
}


async function ensureAudioUnlocked() {
  configureAudioSession();
  
  const ctx = getAudioContext();

  if (!ctx) return false;

  if (ctx.state === 'running') {
    audioUnlocked = true;
    return true;
  }

  // If resume() is already happening, reuse that promise.
  if (unlockPromise) {
    return unlockPromise;
  }

  unlockPromise = ctx
    .resume()
    .then(() => {
      audioUnlocked = ctx.state === 'running';

      if (audioUnlocked) {
        primeAudioContext();
      }

      return audioUnlocked;
    })
    .catch((e) => {
      console.warn('Audio unlock failed:', e);
      return false;
    })
    .finally(() => {
      unlockPromise = null;
    });

  return unlockPromise;
}

function configureAudioSession() {
  if ('audioSession' in navigator) {
    try {
      navigator.audioSession.type = 'playback';
    } catch (e) {
      console.warn('Could not set audio session type:', e);
    }
  }
}

function initSoundEngine() {
  /*
    iOS Safari requires audio to be unlocked from a real
    user gesture.

    We listen globally so interaction with the page can
    wake the audio engine before canvas-generated sounds occur.
  */

  configureAudioSession();

  const unlock = () => {
    configureAudioSession();
    ensureAudioUnlocked();
  };

  document.addEventListener(
    'pointerdown',
    unlock,
    { passive: true, capture: true }
  );

  document.addEventListener(
    'touchstart',
    unlock,
    { passive: true, capture: true }
  );

  document.addEventListener(
    'click',
    unlock,
    { capture: true }
  );

  document.addEventListener(
    'keydown',
    unlock,
    { capture: true }
  );
}


// --------------------------------------------------
// TEAR / AMBIENT CHIME
// --------------------------------------------------

async function playSwoosh() {
  const ready = await ensureAudioUnlocked();

  if (!ready || !audioCtx) return;

  const now = audioCtx.currentTime;

  const root =
    PENTATONIC_ROOTS[
      Math.floor(Math.random() * PENTATONIC_ROOTS.length)
    ];

  CHORD_SEMITONES.forEach((semi, i) => {

    const detuneCents =
      (Math.random() - 0.5) * 8;

    const freq =
      root *
      semitoneRatio(semi) *
      Math.pow(2, detuneCents / 1200);

    const osc =
      audioCtx.createOscillator();

    const filter =
      audioCtx.createBiquadFilter();

    const gain =
      audioCtx.createGain();


    osc.type = 'sine';

    osc.frequency.setValueAtTime(
      freq,
      now
    );


    filter.type = 'lowpass';

    filter.frequency.setValueAtTime(
      900,
      now
    );

    filter.Q.setValueAtTime(
      0.3,
      now
    );


    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);


    const peakVol =
      (0.045 * MASTER_VOLUME) /
      CHORD_SEMITONES.length *
      (1 - i * 0.12);

    const attackTime =
      0.6 + Math.random() * 0.4;

    const releaseTime =
      1.8 + Math.random() * 0.8;


    gain.gain.setValueAtTime(
      0.0001,
      now
    );

    gain.gain.exponentialRampToValueAtTime(
      peakVol,
      now + attackTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + attackTime + releaseTime
    );


    osc.start(now);

    osc.stop(
      now +
      attackTime +
      releaseTime +
      0.1
    );


    osc.onended = () => {
      osc.disconnect();
      filter.disconnect();
      gain.disconnect();
    };
  });
}


// --------------------------------------------------
// MENU BLIP
// --------------------------------------------------

async function playMenuBlip() {
  const ready = await ensureAudioUnlocked();

  if (!ready || !audioCtx) return;

  const now = audioCtx.currentTime;


  const delay =
    audioCtx.createDelay();

  delay.delayTime.setValueAtTime(
    0.09,
    now
  );


  const feedback =
    audioCtx.createGain();

  feedback.gain.setValueAtTime(
    0.35,
    now
  );


  const delayFilter =
    audioCtx.createBiquadFilter();

  delayFilter.type = 'lowpass';

  delayFilter.frequency.setValueAtTime(
    1200,
    now
  );


  delay.connect(feedback);
  feedback.connect(delayFilter);
  delayFilter.connect(delay);
  delay.connect(audioCtx.destination);


  const masterFilter =
    audioCtx.createBiquadFilter();

  masterFilter.type = 'lowpass';

  masterFilter.frequency.setValueAtTime(
    1200,
    now
  );

  masterFilter.connect(audioCtx.destination);
  masterFilter.connect(delay);


  const body =
    audioCtx.createOscillator();

  const bodyGain =
    audioCtx.createGain();


  body.type = 'sine';


  const freq =
    PENTATONIC_ROOTS[
      Math.floor(Math.random() * PENTATONIC_ROOTS.length)
    ] / 1.5;


  body.frequency.setValueAtTime(
    freq,
    now + 0.02
  );


  bodyGain.gain.setValueAtTime(
    0.0001,
    now + 0.02
  );

  bodyGain.gain.exponentialRampToValueAtTime(
    0.03 * MASTER_VOLUME,
    now + 0.08
  );

  bodyGain.gain.exponentialRampToValueAtTime(
    0.0001,
    now + 0.6
  );


  body.connect(bodyGain);
  bodyGain.connect(masterFilter);


  body.start(
    now + 0.02
  );

  body.stop(
    now + 0.65
  );
}


// --------------------------------------------------
// DOM INTERACTIONS
// desktop = hover
// mobile / touch = tap
// --------------------------------------------------

function attachHoverChime(selector, soundFn) {
  const fn = soundFn || playSwoosh;

  document
    .querySelectorAll(selector)
    .forEach((el) => {

      /*
        Desktop mouse:
        preserve the original hover interaction.
      */

      el.addEventListener(
        'mouseenter',
        () => {
          const canHover =
            window.matchMedia(
              '(hover: hover) and (pointer: fine)'
            ).matches;

          if (canHover) {
            fn();
          }
        }
      );


      /*
        Touch devices:
        tapping replaces hover.

        pointerType === "mouse" is ignored,
        otherwise clicking on desktop would trigger
        the sound twice.
      */

      if ('PointerEvent' in window) {

        el.addEventListener(
          'pointerdown',
          (event) => {

            if (event.pointerType !== 'mouse') {
              fn();
            }

          },
          { passive: true }
        );

      } else {

        // older Safari fallback

        el.addEventListener(
          'touchstart',
          () => {
            fn();
          },
          { passive: true }
        );
      }
    });
}


// --------------------------------------------------
// START
// --------------------------------------------------

initSoundEngine();
