# audio-sample

Convert a `Float32Array` of audio samples into a `Buffer` containing signed 16-bit PCM samples. This is useful for sending raw Web Audio samples to a server for further processing.

## Install

```bash
npm install audio-sample
```

## How to use

```ts
import AudioSample from "audio-sample";

const samples = new Float32Array([0.9, 1.08, -0.9, -1.08]);
const audioSample = new AudioSample(samples);
const buffer = audioSample.toBuffer();
```

The decoded signed samples are `[29490, 32767, -29490, -32767]`.

For a Web Audio `AudioBuffer`, `getChannelData()` already returns a `Float32Array`, so no input copy is required:

```ts
const samples = audioBuffer.getChannelData(0);
const buffer = new AudioSample(samples).toBuffer();
```

## Conversion behavior

- Finite samples are clamped to `[-1, 1]`, multiplied by `32767`, and truncated toward zero when stored as signed 16-bit integers.
- Both bounds use the existing `32767` scale: `-1` maps to `-32767`, not `-32768`, and `1` maps to `32767`.
- Each input sample produces exactly two output bytes in the same sample order. Empty input produces an empty buffer.
- Byte order is unchanged from the host's native `Int16Array` representation, typically little-endian. There is no byte swapping; use the matching byte order when reading the buffer.
- The output is raw PCM without a file header, sample rate, or channel metadata.
- Conversion does not modify the source array, apply gain, or normalize loudness. Repeated conversion of unchanged input produces identical bytes.
- The constructor retains the input array by reference. Changes made by the caller are reflected in subsequent calls to `toBuffer()`.

| Input sample | Signed 16-bit output |
| ------------ | -------------------- |
| `0`          | `0`                  |
| `0.9`        | `29490`              |
| `-0.9`       | `-29490`             |
| `1`          | `32767`              |
| `-1`         | `-32767`             |
| `1.08`       | `32767`              |
| `-1.08`      | `-32767`             |
| `2`          | `32767`              |
| `-2`         | `-32767`             |

### Non-finite samples

Non-finite inputs retain their legacy conversion results for compatibility:

| Input sample | Signed 16-bit output |
| ------------ | -------------------- |
| `NaN`        | `0`                  |
| `Infinity`   | `32767`              |
| `-Infinity`  | `0`                  |

These values are not covered by the finite clipping rule. Rejecting them or changing their output would require a separate policy decision.

## Development

Use the Node.js and npm versions specified in [package.json](package.json).

```bash
npm test
npm run types
npm run lint
npm exec -- prettier --check src test README.md
npm run build
```

The Tape tests in [test/test.ts](test/test.ts) import [src/index.ts](src/index.ts) directly through `tsx`, so they exercise source changes rather than generated bundles. The build produces ESM, CommonJS, and UMD bundles.
