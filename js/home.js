(() => {
  if (!window.p5) {
    console.warn('p5.js is not available; home background was not started.');
    return;
  }

  if (window.QRIAN?.ensureGooFilter) {
    QRIAN.ensureGooFilter('goo-home', 14);
  }

  new p5((p) => {
    const NUM_BLOBS = 14;
    const BG = [10, 13, 18];
    const COLOR = [188, 228, 230];

    const blobs = [];
    let wasTouchingBlob = false;

    function makeBlob() {
      return {
        x: p.random(p.width),
        y: p.random(p.height),
        baseR: p.random(18, 42),
        noiseOffX: p.random(1000),
        noiseOffY: p.random(1000),
        breatheOffset: p.random(p.TWO_PI),
        driftSpeed: p.random(0.0009, 0.0018),
        breatheSpeed: p.random(0.003, 0.005)
      };
    }

    p.setup = function () {
      const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
      p.pixelDensity(2);
      canvas.parent(document.body);
      canvas.id('home-layer');
      canvas.style('position', 'fixed');
      canvas.style('top', '0');
      canvas.style('left', '0');
      canvas.style('z-index', '0');
      canvas.style('filter', 'url(#goo-home)');

      for (let i = 0; i < NUM_BLOBS; i++) {
        blobs.push(makeBlob());
      }

      p.frameRate(28);
      setTimeout(
        () => p.resizeCanvas(window.innerWidth, window.innerHeight),
        150
      );
    };

    p.draw = function () {
      p.blendMode(p.BLEND);
      p.background(BG[0], BG[1], BG[2]);
      p.noStroke();

      p.blendMode(p.ADD);
      p.fill(COLOR[0], COLOR[1], COLOR[2], 130);

      let touchingBlob = false;
      const cursor = window.QRIAN?.cursor;

      for (const b of blobs) {
        b.x += (p.noise(b.noiseOffX) - 0.5) * 0.7;
        b.y += (p.noise(b.noiseOffY) - 0.5) * 0.7;
        b.noiseOffX += b.driftSpeed;
        b.noiseOffY += b.driftSpeed;

        if (b.x < -50) b.x = p.width + 50;
        if (b.x > p.width + 50) b.x = -50;
        if (b.y < -50) b.y = p.height + 50;
        if (b.y > p.height + 50) b.y = -50;

        const breathe =
          p.sin(p.frameCount * b.breatheSpeed + b.breatheOffset);
        const r = b.baseR + breathe * (b.baseR * 0.3);

        p.circle(b.x, b.y, r);

        if (
          cursor &&
          p.dist(cursor.x, cursor.y, b.x, b.y) < r / 2 + 14
        ) {
          touchingBlob = true;
        }
      }

      if (
        touchingBlob &&
        !wasTouchingBlob &&
        typeof playSwoosh === 'function'
      ) {
        playSwoosh();
      }

      wasTouchingBlob = touchingBlob;
    };

    p.windowResized = function () {
      p.resizeCanvas(window.innerWidth, window.innerHeight);
    };
  });
})();
