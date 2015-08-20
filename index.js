var toBuffer       = require('typedarray-to-buffer'),
    isFloat32Array = require('validate.io-float32array')

module.exports = function(float32Array) {

    if (!float32Array)
        throw new Error('A Float32Array parameter is missing.')

    if (!isFloat32Array(float32Array))
        throw new Error('The parameter is not a Float32Array.')

    this.toBuffer = function() {

        var l   = float32Array.length,
            arr = new Int16Array(l),
            i

        for (i = 0; i < l; i++) {
            arr[i] = Math.min(1, float32Array[i]) * 0x7FFF
        }

        return toBuffer(arr)
    }
}
