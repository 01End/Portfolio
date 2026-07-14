// ------------------------------------------------------------------
// From-scratch inference engine for the playground digit model.
// Pure functions — no DOM — so it can be verified in Node against
// the Python training outputs (scripts/verify_digits.mjs).
//
// Weight blob layout (Float32, matching scripts/train_digits.py):
//   [W1(in×out) b1 W2 b2 W3 b3], kernels row-major as (in, out).
// ------------------------------------------------------------------

export function createNet(manifest, buffer) {
  const weights = new Float32Array(buffer);
  const layers = [];
  let o = 0;
  for (const { in: nIn, out: nOut } of manifest.layers) {
    const W = weights.subarray(o, o + nIn * nOut);
    o += nIn * nOut;
    const b = weights.subarray(o, o + nOut);
    o += nOut;
    layers.push({ nIn, nOut, W, b });
  }
  return { layers, params: manifest.params };
}

// x: Float32Array(784) in [0,1] → logits Float32Array(10)
export function forward(net, x) {
  let a = x;
  for (let li = 0; li < net.layers.length; li++) {
    const { nIn, nOut, W, b } = net.layers[li];
    const out = new Float32Array(nOut);
    for (let j = 0; j < nOut; j++) out[j] = b[j];
    for (let i = 0; i < nIn; i++) {
      const ai = a[i];
      if (ai === 0) continue; // sparse input speedup
      const row = i * nOut;
      for (let j = 0; j < nOut; j++) out[j] += ai * W[row + j];
    }
    if (li < net.layers.length - 1) {
      for (let j = 0; j < nOut; j++) if (out[j] < 0) out[j] = 0; // relu
    }
    a = out;
  }
  return a;
}

export function softmax(logits) {
  let max = -Infinity;
  for (const v of logits) if (v > max) max = v;
  let sum = 0;
  const out = new Float32Array(logits.length);
  for (let i = 0; i < logits.length; i++) {
    out[i] = Math.exp(logits[i] - max);
    sum += out[i];
  }
  for (let i = 0; i < out.length; i++) out[i] /= sum;
  return out;
}

export function argmax(v) {
  let bi = 0;
  for (let i = 1; i < v.length; i++) if (v[i] > v[bi]) bi = i;
  return bi;
}
