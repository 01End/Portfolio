"""Train the portfolio playground digit model.

Small MLP (784 -> 128 -> 64 -> 10) on MNIST, exported as raw Float32
weights for the hand-rolled JS inference engine (src/js/nn.js).

Outputs:
  public/model/digits.bin   concatenated Float32 weights
                            [W1(784x128) b1 W2(128x64) b2 W3(64x10) b3]
                            kernels stored row-major as (in, out)
  public/model/digits.json  manifest: layer shapes + metadata
  scripts/expected.json     20 test vectors + logits for JS verification
                            (not shipped)
"""

import json
from pathlib import Path

import numpy as np
import tensorflow as tf
from tensorflow import keras

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "model"
OUT.mkdir(parents=True, exist_ok=True)

rng = np.random.default_rng(7)
tf.random.set_seed(7)

# ---- data -----------------------------------------------------------
(x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()
x_train = x_train.astype("float32") / 255.0
x_test = x_test.astype("float32") / 255.0

# shift augmentation (+/- 2px) so hand-drawn strokes off-center still work
def shifted(x, y):
    dx, dy = rng.integers(-2, 3, size=2)
    return np.roll(np.roll(x, dy, axis=1), dx, axis=2), y

xs, ys = shifted(x_train, y_train)
x_aug = np.concatenate([x_train, xs]).reshape(-1, 784)
y_aug = np.concatenate([y_train, ys])
x_test_f = x_test.reshape(-1, 784)

# ---- model ----------------------------------------------------------
model = keras.Sequential(
    [
        keras.layers.Input(shape=(784,)),
        keras.layers.Dense(128, activation="relu"),
        keras.layers.Dense(64, activation="relu"),
        keras.layers.Dense(10),  # logits
    ]
)
model.compile(
    optimizer="adam",
    loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True),
    metrics=["accuracy"],
)
model.fit(x_aug, y_aug, epochs=8, batch_size=128, verbose=2)
loss, acc = model.evaluate(x_test_f, y_test, verbose=0)
print(f"test accuracy: {acc:.4f}")

# ---- export ----------------------------------------------------------
parts, shapes = [], []
for layer in model.layers:
    w, b = layer.get_weights()
    parts += [w.astype("float32").ravel(), b.astype("float32").ravel()]
    shapes.append({"in": int(w.shape[0]), "out": int(w.shape[1])})

blob = np.concatenate(parts)
# .dat, not .bin — some antivirus web filters block .bin downloads
(OUT / "digits.dat").write_bytes(blob.tobytes())
(OUT / "digits.json").write_text(
    json.dumps(
        {
            "layers": shapes,
            "params": int(blob.size),
            "testAccuracy": round(float(acc), 4),
            "note": "MLP trained on MNIST; raw Float32; kernel row-major (in,out)",
        },
        indent=2,
    )
)

# verification vectors for the JS engine
idx = rng.choice(len(x_test_f), 20, replace=False)
logits = model.predict(x_test_f[idx], verbose=0)
(Path(__file__).parent / "expected.json").write_text(
    json.dumps(
        {
            "inputs": [np.round(v, 6).tolist() for v in x_test_f[idx]],
            "logits": [np.round(v, 5).tolist() for v in logits],
            "labels": [int(v) for v in y_test[idx]],
        }
    )
)

print(f"exported {blob.size} params ({blob.nbytes / 1024:.0f} KB) -> {OUT}")
