import typedarray_to_buffer from "typedarray-to-buffer";
function _define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
class AudioSample {
    toBuffer() {
        const l = this.float32Array.length;
        const arr = new Int16Array(l);
        this.float32Array.forEach((sample, i)=>{
            arr[i] = 0x7fff * Math.min(1, sample);
        });
        return typedarray_to_buffer(arr);
    }
    constructor(float32Array){
        _define_property(this, "float32Array", void 0);
        this.float32Array = float32Array;
    }
}
const src = AudioSample;
export default src;
