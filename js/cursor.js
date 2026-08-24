(() => {
  window.QRIAN = window.QRIAN || {};

  QRIAN.ensureGooFilter = function ensureGooFilter(id, stdDeviation) {
    if (document.getElementById(id)) return;

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';

    const filter = document.createElementNS(svgNS, 'filter');
    filter.setAttribute('id', id);

    const blur = document.createElementNS(svgNS, 'feGaussianBlur');
    blur.setAttribute('in', 'SourceGraphic');
    blur.setAttribute('stdDeviation', String(stdDeviation));
    blur.setAttribute('result', 'soft');

    filter.appendChild(blur);
    svg.appendChild(filter);
    document.body.appendChild(svg);
  };

  if (!window.p5) {
    console.warn('p5.js is not available; cursor tear was not started.');
    return;
  }

  QRIAN.ensureGooFilter('goo-cursor', 14);

  QRIAN.cursor = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  };

  new p5((p) => {
    let followerX = window.innerWidth / 2;
    let followerY = window.innerHeight / 2;
    let followerVX = 0;
    let followerVY = 0;

    const SPRING = 0.035;
    const DAMPING = 0.72;
    const TRAIL_LENGTH = 6;
    const COLOR = [188, 228, 230];
    const trail = [];

    p.setup = function () {
      const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
      p.pixelDensity(2);
      canvas.parent(document.body);
      canvas.id('cursor-layer');
      canvas.style('filter', 'url(#goo-cursor)');

      if (typeof attachHoverChime === 'function') {
        attachHoverChime('.code-nav a, .logo', playMenuBlip);
        attachHoverChime('#corner-drop');
      }

      p.frameRate(30);
    };

    p.draw = function () {
      p.clear();

      const ax = (p.mouseX - followerX) * SPRING;
      const ay = (p.mouseY - followerY) * SPRING;

      followerVX = (followerVX + ax) * DAMPING;
      followerVY = (followerVY + ay) * DAMPING;
      followerX += followerVX;
      followerY += followerVY;

      QRIAN.cursor.x = followerX;
      QRIAN.cursor.y = followerY;

      trail.push({ x: followerX, y: followerY });
      if (trail.length > TRAIL_LENGTH) trail.shift();

      p.blendMode(p.ADD);
      p.noFill();
      p.strokeCap(p.ROUND);
      p.strokeJoin(p.ROUND);

      for (let i = 0; i < trail.length - 1; i++) {
        const t = i / trail.length;
        const a = trail[i];
        const b = trail[i + 1];

        p.stroke(COLOR[0], COLOR[1], COLOR[2], 65 * t);
        p.strokeWeight(24);
        p.line(a.x, a.y, b.x, b.y);
      }

      p.noStroke();

      const speed = p.mag(followerVX, followerVY);
      const angle = p.atan2(followerVY, followerVX);
      const stretch = p.constrain(speed * 0.22, 0, 10);
      const breathe = 18 + p.sin(p.frameCount * 0.02) * 2.7;

      p.push();
      p.translate(followerX, followerY);
      p.rotate(angle);
      p.fill(COLOR[0], COLOR[1], COLOR[2], 150);
      p.ellipse(
        0,
        0,
        breathe + stretch,
        breathe - stretch * 0.5
      );
      p.pop();
    };

    p.windowResized = function () {
      p.resizeCanvas(window.innerWidth, window.innerHeight);
    };
  });
})();
