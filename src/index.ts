import toBuffer from "typedarray-to-buffer";

class AudioSample {
  private readonly float32Array: Float32Array;

  constructor(float32Array: Float32Array) {
    this.float32Array = float32Array;
  }

  public toBuffer() {
    const l = this.float32Array.length;
    const arr = new Int16Array(l);

    this.float32Array.forEach((sample, i) => {
      arr[i] = Math.min(1, sample) * 0x7fff;
    });

    return toBuffer(arr);
  }
}

export default AudioSample;
