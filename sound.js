// ============================================
// QRIAN — 공용 사운드 엔진
// 모든 페이지(Home, Works, Biography...)에서 이 파일 하나를 불러다 씀
// 여기만 고치면 사이트 전체 사운드가 한 번에 바뀜
// ============================================

let audioCtx = null;
let audioUnlocked = false;

const PENTATONIC_ROOTS = [261.63, 293.66, 329.63, 392.00, 440.00]; // C4 D4 E4 G4 A4
// 루트 + 완전4도(5반음) + 단7도(10반음) = 7sus4 보이싱
const CHORD_SEMITONES = [0, 5, 10];
function semitoneRatio(n) { return Math.pow(2, n / 12); }

function initSoundEngine() {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    console.warn('오디오 컨텍스트 생성 실패, 시각적인 부분엔 영향 없음:', e);
  }

  // 브라우저 자동재생 정책 때문에, 첫 클릭에서 오디오 잠금 해제
  document.addEventListener('click', () => {
    if (!audioUnlocked && audioCtx) {
      audioCtx.resume();
      audioUnlocked = true;
    }
  });
}

// 호버할 때마다 살짝 다른, 하지만 항상 어울리는 앰비언트 화음을 재생함
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

// 지정한 CSS 선택자에 해당하는 모든 요소에 "마우스 올리면 화음" 붙여주는 헬퍼
// 사이드바 메뉴, 코너의 정적인 눈물 점 등 캔버스가 아닌 일반 DOM 요소에 사용
function attachHoverChime(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener('mouseenter', () => playSwoosh());
  });
}

// 페이지 로드되면 바로 오디오 엔진 준비
initSoundEngine();
