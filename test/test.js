var test        = require('tape'),
    AudioSample = require('../')

test('AudioSample', function(t) {

    t.test('invalidates bad parameters in constructor such as:', function(tt) {

        tt.test('missing ones', function(ttt) {
            ttt.plan(1)

            ttt.throws(function() {
                new AudioSample()
            })
        })

        tt.test('string', function(ttt) {
            ttt.plan(1)

            ttt.throws(function() {
                new AudioSample('i am a bad parameter')
            })
        })

        tt.test('array buffer', function(ttt) {
            ttt.plan(1)

            ttt.throws(function() {
                new AudioSample(new ArrayBuffer(10))
            })
        })

        tt.test('Float64Array', function(ttt) {
            ttt.plan(1)

            ttt.throws(function() {
                new AudioSample(new Float64Array(10))
            })
        })

        tt.test('Int16Array', function(ttt) {
            ttt.plan(1)

            ttt.throws(function() {
                new AudioSample(new Int16Array(10))
            })
        })

        tt.test('but accepts a Float32Array fine', function(ttt) {
            ttt.plan(1)

            ttt.doesNotThrow(function() {
                new AudioSample(new Float32Array(10))
            })
        })
    })

    t.test('toBuffer():', function(tt) {
        tt.test('converts the empty Float32Array into an empty buffer', function(ttt) {
            ttt.plan(1)

            var audioSample = new AudioSample(new Float32Array()),
                buffer      = audioSample.toBuffer()

            ttt.equal(buffer.length, 0)
        })

        tt.test('converts the small Float32Array into a small buffer', function(ttt) {
            ttt.plan(5)

            var audioSample = new AudioSample(new Float32Array([21, 31])),
                buffer      = audioSample.toBuffer()

            // https://nodejs.org/api/buffer.html
            ttt.equal(buffer.length, 4)
            ttt.equal(buffer[0], 255)
            ttt.equal(buffer[1], 127)
            ttt.equal(buffer[2], 255)
            ttt.equal(buffer[3], 127)
        })
    })
})
