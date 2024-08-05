import r from"typedarray-to-buffer";var t=/*#__PURE__*/function(){function t(r){this.float32Array=void 0,this.float32Array=r}return t.prototype.toBuffer=function(){var t=new Int16Array(this.float32Array.length);return this.float32Array.forEach(function(r,a){t[a]=32767*Math.min(1,r)}),r(t)},t}();export{t as default};
//# sourceMappingURL=audio-sample.esm.js.map
