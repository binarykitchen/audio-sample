import toBuffer from "typedarray-to-buffer";

class AudioSample {
  private readonly float32Array: Float32Array;

  constructor(float32Array: Float32Array) {
    this.float32Array = float32Array;
  }

  public toBuffer() {
    const l = this.float32Array.length;
    // Allocate one signed 16-bit PCM slot (two bytes) per input sample.
    const arr = new Int16Array(l);

    this.float32Array.forEach((sample, i) => {
      // Clamp finite negative overflow; preserve legacy NaN and infinity handling.
      const clampedSample = Number.isFinite(sample) ? Math.max(-1, sample) : sample;
      // Cap positive overflow and retain the existing 32767 scale.
      // Int16Array assignment truncates fractional values toward zero.
      arr[i] = Math.min(1, clampedSample) * 0x7fff;
    });

    // Share the PCM bytes as a Buffer, preserving the host's native byte order.
    return toBuffer(arr);
  }
}

export default AudioSample;
