var r=require("typedarray-to-buffer"),a=require("validate.io-float32array");module.exports=function(e){if(!e)throw new Error("A Float32Array parameter is missing.");if(!a(e))throw new Error("The parameter is not a Float32Array.");this.toBuffer=function(){var a,t=e.length,o=new Int16Array(t);for(a=0;a<t;a++)o[a]=32767*Math.min(1,e[a]);return r(o)}};
//# sourceMappingURL=audio-sample.mjs.map
