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
      ttt.equal(buffer[4], 10);
      ttt.equal(buffer[5], 0);
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

    // todo
    // tt.test('test with random, huge arrays', function(ttt) {
    // })
  });
});
