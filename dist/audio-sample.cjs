function t(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var r=/*#__PURE__*/t(require("typedarray-to-buffer"));module.exports=/*#__PURE__*/function(){function t(t){this.float32Array=void 0,this.float32Array=t}return t.prototype.toBuffer=function(){var t=new Int16Array(this.float32Array.length);return this.float32Array.forEach(function(r,o){t[o]=32767*Math.min(1,r)}),r.default(t)},t}();
//# sourceMappingURL=audio-sample.cjs.map