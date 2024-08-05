import r from"typedarray-to-buffer";class t{constructor(r){this.float32Array=void 0,this.float32Array=r}toBuffer(){const t=new Int16Array(this.float32Array.length);return this.float32Array.forEach((r,a)=>{t[a]=32767*Math.min(1,r)}),r(t)}}export{t as default};
//# sourceMappingURL=audio-sample.modern.js.map
