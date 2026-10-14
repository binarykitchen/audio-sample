import test from "tape";
import AudioSample from "../src/index";

test("AudioSample", function (t) {
  t.test("invalidates bad parameters in constructor such as:", function (tt) {
    tt.test("but accepts a Float32Array fine", function (ttt) {
      ttt.plan(1);

      ttt.doesNotThrow(function () {
        new AudioSample(new Float32Array(10));
      });
    });
  });

  t.test("toBuffer():", function (tt) {
    tt.test("converts the empty Float32Array into an empty buffer", function (ttt) {
      ttt.plan(1);

      const audioSample = new AudioSample(new Float32Array());
      const buffer = audioSample.toBuffer();

      ttt.equal(buffer.length, 0);
    });

    tt.test("converts the small Float32Array into a small buffer", function (ttt) {
      ttt.plan(7);

      const audioSample = new AudioSample(new Float32Array([21, 31, -10]));
      const buffer = audioSample.toBuffer();

      ttt.equal(buffer.length, 6);
      ttt.equal(buffer[0], 255);
      ttt.equal(buffer[1], 127);
      ttt.equal(buffer[2], 255);
      ttt.equal(buffer[3], 127);
      ttt.equal(buffer[4], 1);
      ttt.equal(buffer[5], 128);
    });

    tt.test("converts a sensible Float32Array into correct buffer", function (ttt) {
      ttt.plan(13);

      const audioSample = new AudioSample(
        new Float32Array([0.1, 0, 0.3, -0, -0.37, 1.1]),
      );
      const buffer = audioSample.toBuffer();

      ttt.equal(buffer.length, 12);
      ttt.equal(buffer[0], 204);
      ttt.equal(buffer[1], 12);
      ttt.equal(buffer[2], 0);
      ttt.equal(buffer[3], 0);
      ttt.equal(buffer[4], 102);
      ttt.equal(buffer[5], 38);
      ttt.equal(buffer[6], 0);
      ttt.equal(buffer[7], 0);
      ttt.equal(buffer[8], 165);
      ttt.equal(buffer[9], 208);
      ttt.equal(buffer[10], 255);
      ttt.equal(buffer[11], 127);
    });

    tt.test("clamps finite samples to both full-scale boundaries", function (ttt) {
      const samples = new Float32Array([
        0, 0.9, -0.9, 1, -1, -1.08, 1.08, -2, 2, -3.4028234663852886e38,
        3.4028234663852886e38,
      ]);
      const expectedSamples = [
        0, 29490, -29490, 32767, -32767, -32767, 32767, -32767, 32767, -32767, 32767,
      ];

      ttt.plan(expectedSamples.length + 1);

      const buffer = new AudioSample(samples).toBuffer();

      ttt.equal(buffer.length, samples.length * 2);
      expectedSamples.forEach((expectedSample, index) => {
        ttt.equal(
          buffer.readInt16LE(index * 2),
          expectedSample,
          `converts ${String(samples[index])} without wrapping`,
        );
      });
    });

    tt.test("preserves in-range scaling and truncation toward zero", function (ttt) {
      ttt.plan(2);

      const samples = new Float32Array([
        -1,
        -0.99999,
        -0.9,
        -0.5,
        -0.37,
        -0.1,
        -0.5 / 0x7fff,
        -(2 ** -149),
        -0,
        0,
        2 ** -149,
        0.5 / 0x7fff,
        0.1,
        0.3,
        0.37,
        0.5,
        0.9,
        0.99999,
        1,
      ]);
      const expectedSamples = Array.from(
        samples,
        (sample) => Math.trunc(sample * 0x7fff) || 0,
      );
      const buffer = new AudioSample(samples).toBuffer();
      const actualSamples = Array.from(samples, (_, index) =>
        buffer.readInt16LE(index * 2),
      );

      ttt.equal(buffer.length, samples.length * 2);
      ttt.deepEqual(actualSamples, expectedSamples);
    });

    tt.test("converts repeatedly without changing the source array", function (ttt) {
      ttt.plan(4);

      const samples = new Float32Array([
        0,
        -0,
        0.9,
        -0.9,
        1,
        -1,
        1.08,
        -1.08,
        2,
        -2,
        NaN,
        Infinity,
        -Infinity,
      ]);
      const originalBytes = new Uint8Array(samples.buffer.slice(0));
      const audioSample = new AudioSample(samples);
      const firstBuffer = audioSample.toBuffer();

      ttt.equal(firstBuffer.length, samples.length * 2);
      ttt.deepEqual(new Uint8Array(samples.buffer), originalBytes);

      const secondBuffer = audioSample.toBuffer();

      ttt.deepEqual(secondBuffer, firstBuffer);
      ttt.deepEqual(new Uint8Array(samples.buffer), originalBytes);
    });

    tt.test("preserves existing non-finite sample conversion", function (ttt) {
      ttt.plan(4);

      const samples = new Float32Array([NaN, Infinity, -Infinity]);
      const buffer = new AudioSample(samples).toBuffer();

      ttt.equal(buffer.length, samples.length * 2);
      ttt.equal(buffer.readInt16LE(0), 0);
      ttt.equal(buffer.readInt16LE(2), 32767);
      ttt.equal(buffer.readInt16LE(4), 0);
    });

    // todo
    // tt.test('test with random, huge arrays', function(ttt) {
    // })
  });
});
