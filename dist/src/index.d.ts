declare class AudioSample {
    private readonly float32Array;
    constructor(float32Array: Float32Array);
    toBuffer(): Buffer;
}
export default AudioSample;
