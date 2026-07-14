// Verifies the from-scratch JS engine (src/js/nn.js) reproduces the
// Python model's outputs on 20 held-out MNIST samples.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createNet, forward, softmax, argmax } from '../src/js/nn.js';

const here = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(readFileSync(join(here, '../public/model/digits.json')));
const bin = readFileSync(join(here, '../public/model/digits.dat'));
const expected = JSON.parse(readFileSync(join(here, 'expected.json')));

const net = createNet(manifest, bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength));

let agree = 0;
let maxDiff = 0;
expected.inputs.forEach((input, i) => {
  const logits = forward(net, Float32Array.from(input));
  const p = softmax(logits);
  const pRef = softmax(Float32Array.from(expected.logits[i]));
  for (let j = 0; j < 10; j++) maxDiff = Math.max(maxDiff, Math.abs(p[j] - pRef[j]));
  if (argmax(logits) === argmax(Float32Array.from(expected.logits[i]))) agree++;
});

console.log(`argmax agreement: ${agree}/20`);
console.log(`max softmax diff: ${maxDiff.toExponential(2)}`);
if (agree !== 20 || maxDiff > 1e-3) {
  console.error('VERIFICATION FAILED');
  process.exit(1);
}
console.log('VERIFICATION PASSED');
