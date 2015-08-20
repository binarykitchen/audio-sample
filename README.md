[![Build Status](https://travis-ci.org/binarykitchen/audio-sample.svg?branch=master)](https://travis-ci.org/binarykitchen/audio-sample)

# audio-sample

That's an audio sample class, accepting a Float32Array in the constructor with one public function. It turns that Float32 into a buffer with the most fastest algorithm.

This within ~20 code lines only by reusing other useful node modules. It cannot get faster and shorter. If I am wrong, let me know and I'll fix that asap.

This component is very useful for turning raw WebAudio samples, which are in Float32, into a buffer with 16 bit signed integers while respecting endianness.

For inspiration refer to:
http://blog.groupbuddies.com/posts/39-tutorial-html-audio-capture-streaming-to-node-js-no-browser-extensions

## Install
```
npm i -S audio-sample
```

## How to use

```
// just an example, this array can come from the first audio channel of a webcam (getUserMedia)
var arrayOfFloats = e.inputBuffer.getChannelData(0)

// create a single audio sample instance
var audioSample = new AudioSample(new Float32Array(arrayOfFloats))

// and now, convert it into a buffer super-fast
var buffer = audioSample.toBuffer()

// then you can send this buffer easily over to the server and do some processing there
```
