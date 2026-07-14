import { createNet, forward, softmax, argmax } from './nn.js';

// ------------------------------------------------------------------
// Playground: draw a digit, the network reads it live.
// Weights are lazy-fetched when the section approaches the viewport.
// Preprocessing mirrors MNIST: crop ink bbox → scale longest side to
// 20px → place in 28×28 → shift so the center of mass sits at (14,14).
// ------------------------------------------------------------------

const PAD = 280; // drawing canvas logical size

export function initPlayground() {
  const section = document.getElementById('playground');
  const pad = document.getElementById('play-pad');
  const barsBox = document.getElementById('play-bars');
  const topEl = document.getElementById('play-top');
  const meta = document.getElementById('play-meta');
  if (!section || !pad) return;

  const ctx = pad.getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, PAD, PAD);

  // ---- probability bars -------------------------------------------
  const bars = [];
  for (let d = 0; d < 10; d++) {
    const row = document.createElement('div');
    row.className = 'play-bar';
    row.innerHTML = `<span class="play-bar-label mono">${d}</span>
      <span class="play-bar-track"><span class="play-bar-fill"></span></span>
      <span class="play-bar-pct mono">0%</span>`;
    barsBox.appendChild(row);
    bars.push({
      row,
      fill: row.querySelector('.play-bar-fill'),
      pct: row.querySelector('.play-bar-pct'),
    });
  }

  // ---- lazy model load ---------------------------------------------
  let net = null;
  let loading = false;

  async function loadModel() {
    if (net || loading) return;
    loading = true;
    meta.textContent = 'loading weights…';
    try {
      // .dat, not .bin — some antivirus web filters block .bin downloads
      const [manifest, bin] = await Promise.all([
        fetch('model/digits.json').then((r) => r.json()),
        fetch('model/digits.dat').then((r) => r.arrayBuffer()),
      ]);
      if (!bin.byteLength) throw new Error('empty weights');
      net = createNet(manifest, bin);
      meta.textContent =
        `${manifest.params.toLocaleString()} params · ` +
        `${Math.round(manifest.testAccuracy * 1000) / 10}% on mnist · ` +
        'inference engine written from scratch — no libraries';
    } catch {
      meta.textContent = 'could not load the model — try reloading';
    }
    loading = false;
  }

  new IntersectionObserver(
    ([e], obs) => {
      if (e.isIntersecting) {
        loadModel();
        obs.disconnect();
      }
    },
    { rootMargin: '600px' }
  ).observe(section);

  // ---- drawing -------------------------------------------------------
  let drawing = false;
  let hasInk = false;
  let last = null;

  const toPad = (e) => {
    const r = pad.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * PAD,
      y: ((e.clientY - r.top) / r.height) * PAD,
    };
  };

  pad.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    pad.setPointerCapture(e.pointerId);
    drawing = true;
    last = toPad(e);
    stroke(last, last);
  });

  pad.addEventListener('pointermove', (e) => {
    if (!drawing) return;
    const p = toPad(e);
    stroke(last, p);
    last = p;
  });

  const stop = () => {
    drawing = false;
    schedulePredict();
  };
  pad.addEventListener('pointerup', stop);
  pad.addEventListener('pointercancel', stop);

  function stroke(a, b) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    hasInk = true;
    schedulePredict();
  }

  let rafId = null;
  function schedulePredict() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      predict();
    });
  }

  document.getElementById('play-clear')?.addEventListener('click', () => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, PAD, PAD);
    hasInk = false;
    topEl.textContent = '?';
    topEl.classList.remove('is-sure');
    bars.forEach((b) => {
      b.fill.style.width = '0%';
      b.pct.textContent = '0%';
      b.row.classList.remove('is-top');
    });
  });

  // ---- preprocessing + inference --------------------------------------
  const small = document.createElement('canvas');
  small.width = 28;
  small.height = 28;
  const sctx = small.getContext('2d', { willReadFrequently: true });

  function predict() {
    if (!net || !hasInk) return;

    // ink bounding box on the pad
    const img = ctx.getImageData(0, 0, PAD, PAD).data;
    let minX = PAD, minY = PAD, maxX = 0, maxY = 0, found = false;
    for (let y = 0; y < PAD; y++) {
      for (let x = 0; x < PAD; x++) {
        if (img[(y * PAD + x) * 4] > 20) {
          found = true;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (!found) return;

    // crop → scale longest side to 20 → center in 28×28
    const bw = maxX - minX + 1;
    const bh = maxY - minY + 1;
    const scale = 20 / Math.max(bw, bh);
    const dw = Math.max(1, Math.round(bw * scale));
    const dh = Math.max(1, Math.round(bh * scale));
    sctx.fillStyle = '#000';
    sctx.fillRect(0, 0, 28, 28);
    sctx.drawImage(pad, minX, minY, bw, bh, (28 - dw) / 2, (28 - dh) / 2, dw, dh);

    // center of mass shift (MNIST-style)
    let d = sctx.getImageData(0, 0, 28, 28).data;
    let sum = 0, sx = 0, sy = 0;
    for (let y = 0; y < 28; y++) {
      for (let x = 0; x < 28; x++) {
        const v = d[(y * 28 + x) * 4];
        sum += v;
        sx += x * v;
        sy += y * v;
      }
    }
    const dx = Math.round(13.5 - sx / sum);
    const dy = Math.round(13.5 - sy / sum);
    if (dx || dy) {
      const shifted = sctx.getImageData(0, 0, 28, 28);
      sctx.fillStyle = '#000';
      sctx.fillRect(0, 0, 28, 28);
      sctx.putImageData(shifted, dx, dy);
      d = sctx.getImageData(0, 0, 28, 28).data;
    }

    const x = new Float32Array(784);
    for (let i = 0; i < 784; i++) x[i] = d[i * 4] / 255;

    const t0 = performance.now();
    const probs = softmax(forward(net, x));
    const ms = performance.now() - t0;

    const top = argmax(probs);
    topEl.textContent = String(top);
    topEl.classList.toggle('is-sure', probs[top] > 0.6);
    bars.forEach((b, i) => {
      const pc = Math.round(probs[i] * 100);
      b.fill.style.width = `${pc}%`;
      b.pct.textContent = `${pc}%`;
      b.row.classList.toggle('is-top', i === top);
    });
    meta.dataset.ms = ms.toFixed(1);
    if (net) {
      meta.textContent =
        `${net.params.toLocaleString()} params · inference ${ms.toFixed(1)}ms · ` +
        'engine written from scratch — no libraries';
    }
  }
}
