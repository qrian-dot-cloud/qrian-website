(() => {
  if (!window.p5) {
    console.warn('p5.js is not available; QRIAN.world was not started.');
    return;
  }

  if (!window.WORKS && typeof WORKS === 'undefined') {
    console.warn('WORKS data is missing.');
    return;
  }

  if (window.QRIAN?.ensureGooFilter) {
    QRIAN.ensureGooFilter('goo-world', 1.5);
  }

  new p5((p) => {
    const BG = [10, 13, 18];
    const COLOR = [188, 228, 230];

    let nodes = [];
    let tooltip = null;
    let previousHoveredTitle = null;

    function sidebarOffsetX() {
      return window.innerWidth <= 640 ? 0 : 280;
    }

    function sidebarOffsetY() {
      return window.innerWidth <= 640 ? 70 : 0;
    }

    function nodeScale() {
      const raw =
        getComputedStyle(document.documentElement)
          .getPropertyValue('--world-node-scale')
          .trim();

      const parsed = Number(raw);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    }

    function sharedTagCount(a, b) {
      return a.tags.filter((tag) => b.tags.includes(tag)).length;
    }

    function tagSimilarity(a, b) {
      const shared = sharedTagCount(a, b);
      if (shared === 0) return 0;

      const unionSize = new Set([...a.tags, ...b.tags]).size;
      return shared / unionSize;
    }

    function teardropPath(cx, cy, r) {
      const w = r * 1.3;
      const h = r * 1.5;
      const top = cy - h / 2;
      const bottom = cy + h / 2;

      p.drawingContext.beginPath();
      p.drawingContext.moveTo(cx, top);

      p.drawingContext.bezierCurveTo(
        cx + w / 2,
        cy - h * 0.08,
        cx + w / 2,
        cy + h * 0.32,
        cx,
        bottom
      );

      p.drawingContext.bezierCurveTo(
        cx - w / 2,
        cy + h * 0.32,
        cx - w / 2,
        cy - h * 0.08,
        cx,
        top
      );

      p.drawingContext.closePath();
    }

    function centerOfWorld() {
      return {
        x:
          sidebarOffsetX() +
          (p.width - sidebarOffsetX()) * 0.38,
        y:
          sidebarOffsetY() +
          (p.height - sidebarOffsetY()) / 2
      };
    }

    function positionCaption() {
      const photo = document.getElementById('hover-photo');
      const caption = document.getElementById('hover-caption');

      if (!photo || !caption) return;

      const rect = photo.getBoundingClientRect();
      const styles = getComputedStyle(document.documentElement);
      const gap =
        parseFloat(styles.getPropertyValue('--world-caption-gap')) || 12;

      caption.style.top = `${rect.bottom + gap}px`;
      caption.style.right =
        `${window.innerWidth - rect.right}px`;
      caption.style.maxWidth = `${rect.width * 1.45}px`;
    }

    function updateHoverDOM(hovered) {
      const hoverImg = document.getElementById('hover-img');
      const hoverCaption = document.getElementById('hover-caption');
      const hoverSeries = document.getElementById('hover-series');
      const hoverTitle = document.getElementById('hover-title');
      const hoverKeywords = document.getElementById('hover-keywords');

      const currentTitle = hovered ? hovered.title : null;

      if (
        currentTitle &&
        currentTitle !== previousHoveredTitle &&
        typeof audioUnlocked !== 'undefined' &&
        audioUnlocked &&
        typeof playSwoosh === 'function'
      ) {
        playSwoosh();
      }

      previousHoveredTitle = currentTitle;

      if (!hovered) {
        if (tooltip) tooltip.style.opacity = 0;
        hoverImg?.classList.remove('active');
        hoverCaption?.classList.remove('active');
        document.body.style.cursor = 'default';
        return;
      }

      if (tooltip) {
        tooltip.textContent = hovered.title;
        tooltip.style.left = `${hovered.x}px`;
        tooltip.style.top = `${hovered.y}px`;
        tooltip.style.opacity = 1;
      }

      document.body.style.cursor = 'pointer';

      if (hoverImg) {
        if (hoverImg.dataset.current !== hovered.imgUrl) {
          hoverImg.src = hovered.imgUrl;
          hoverImg.dataset.current = hovered.imgUrl;
        }
        hoverImg.classList.add('active');
      }

      if (hoverSeries) {
        hoverSeries.textContent = hovered.series || '';
        hoverSeries.style.display =
          hovered.series ? 'block' : 'none';
      }

      if (hoverTitle) {
        hoverTitle.textContent = hovered.title;
      }

      if (hoverKeywords) {
        hoverKeywords.innerHTML =
          hovered.desc.replace(' (', '<br>(');
      }

      hoverCaption?.classList.add('active');
    }

    p.setup = function () {
      const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
      p.pixelDensity(2);
      canvas.parent(document.body);
      canvas.id('world-layer');
      canvas.style('filter', 'url(#goo-world)');

      tooltip = document.getElementById('tooltip');

      const center = centerOfWorld();

      nodes = WORKS.map((work, index) => {
        const angle = (index / WORKS.length) * p.TWO_PI;
        const startRadius = 120;

        return {
          title: work.title,
          tags: work.tags,
          series: work.series || null,
          zone: work.zone || null,
          link: work.link || null,
          pin: work.pin || null,
          desc: work.desc || '',
          imgUrl: work.img,

          x:
            center.x +
            p.cos(angle) * startRadius +
            p.random(-20, 20),

          y:
            center.y +
            p.sin(angle) * startRadius +
            p.random(-20, 20),

          vx: 0,
          vy: 0,
          r: (5 + work.tags.length * 0.6) * nodeScale(),
          breatheOffset: p.random(p.TWO_PI)
        };
      });

      positionCaption();
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

      let hovered = null;
      const center = centerOfWorld();

      for (const node of nodes) {
        for (const other of nodes) {
          if (other === node) continue;

          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const d = p.constrain(p.mag(dx, dy), 20, 2000);

          const repel = 9500 / (d * d);
          node.vx -= (dx / d) * repel;
          node.vy -= (dy / d) * repel;

          const similarity = tagSimilarity(node, other);

          if (similarity > 0) {
            const pull = similarity * d * 0.00035;
            node.vx += (dx / d) * pull;
            node.vy += (dy / d) * pull;
          }

          if (node.series && other.series === node.series) {
            const seriesPull = d * 0.0012;
            node.vx += (dx / d) * seriesPull;
            node.vy += (dy / d) * seriesPull;
          }
        }

        node.vx += (center.x - node.x) * 0.00012;
        node.vy += (center.y - node.y) * 0.00012;

        if (node.pin) {
          const mapLeft = sidebarOffsetX();
          const mapTop = sidebarOffsetY();
          const mapW = p.width - mapLeft;
          const mapH = p.height - mapTop;
          const pinX = mapLeft + mapW * node.pin.x;
          const pinY = mapTop + mapH * node.pin.y;

          node.vx += (pinX - node.x) * 0.0015;
          node.vy += (pinY - node.y) * 0.0015;
        }

        node.vx *= 0.88;
        node.vy *= 0.88;
        node.x += node.vx;
        node.y += node.vy;

        const maxRadius =
          p.min(
            p.width - sidebarOffsetX(),
            p.height - sidebarOffsetY()
          ) / 2 - 40;

        const dx2 = node.x - center.x;
        const dy2 = node.y - center.y;
        const distFromCenter = p.mag(dx2, dy2);

        if (distFromCenter > maxRadius) {
          const scale = maxRadius / distFromCenter;
          node.x = center.x + dx2 * scale;
          node.y = center.y + dy2 * scale;
        }

        if (p.dist(p.mouseX, p.mouseY, node.x, node.y) < node.r + 2) {
          hovered = node;
        }
      }

      // Main connection layer
      p.blendMode(p.ADD);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const similarity = tagSimilarity(a, b);

          if (similarity <= 0) continue;

          const isSeriesMate =
            a.series && a.series === b.series;
          const boost = isSeriesMate ? 1.6 : 1;

          p.stroke(
            COLOR[0],
            COLOR[1],
            COLOR[2],
            p.constrain(
              similarity * 110 * boost,
              15,
              85
            )
          );

          p.strokeWeight(
            p.constrain(
              similarity * 2.6 * boost,
              0.8,
              2.3
            )
          );

          p.line(a.x, a.y, b.x, b.y);
        }
      }

      p.noStroke();

      // Tear nodes
      for (const node of nodes) {
        const breathe =
          p.sin(p.frameCount * 0.02 + node.breatheOffset) * 3;
        const displayR = node.r + breathe / 2;
        const isHover = node === hovered;

        p.blendMode(p.ADD);
        p.noStroke();

        teardropPath(node.x, node.y, displayR + 3);
        p.drawingContext.fillStyle =
          `rgba(${COLOR[0]}, ${COLOR[1]}, ${COLOR[2]}, ` +
          `${(isHover ? 90 : 50) / 255})`;
        p.drawingContext.fill();

        p.blendMode(p.BLEND);

        teardropPath(node.x, node.y, displayR);
        p.drawingContext.fillStyle =
          `rgba(${COLOR[0]}, ${COLOR[1]}, ${COLOR[2]}, ` +
          `${(isHover ? 210 : 140) / 255})`;
        p.drawingContext.fill();
      }

      // Fine connection layer
      p.blendMode(p.ADD);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const similarity = tagSimilarity(a, b);

          if (similarity <= 0) continue;

          const isSeriesMate =
            a.series && a.series === b.series;
          const boost = isSeriesMate ? 1.6 : 1;

          p.stroke(
            COLOR[0],
            COLOR[1],
            COLOR[2],
            p.constrain(
              similarity * 65 * boost,
              10,
              55
            )
          );

          p.strokeWeight(
            p.constrain(
              similarity * 1.6 * boost,
              0.5,
              1.5
            )
          );

          p.line(a.x, a.y, b.x, b.y);
        }
      }

      p.noStroke();
      updateHoverDOM(hovered);
    };

    p.mouseClicked = function () {
      for (const node of nodes) {
        if (
          p.dist(p.mouseX, p.mouseY, node.x, node.y) <
            node.r + 4 &&
          node.link
        ) {
          window.location.href = node.link;
          return;
        }
      }
    };

    p.windowResized = function () {
      p.resizeCanvas(window.innerWidth, window.innerHeight);
      positionCaption();
    };

    window.addEventListener('resize', positionCaption);
    window.addEventListener('load', positionCaption);
  });
})();
