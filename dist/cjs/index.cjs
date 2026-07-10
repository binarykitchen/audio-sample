var __webpack_modules__ = {
    526 (__unused_rspack_module, exports1) {
        "use strict";
        exports1.byteLength = byteLength;
        exports1.toByteArray = toByteArray;
        exports1.fromByteArray = fromByteArray;
        var lookup = [];
        var revLookup = [];
        var Arr = "u" > typeof Uint8Array ? Uint8Array : Array;
        var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        for(var i = 0, len = code.length; i < len; ++i){
            lookup[i] = code[i];
            revLookup[code.charCodeAt(i)] = i;
        }
        revLookup['-'.charCodeAt(0)] = 62;
        revLookup['_'.charCodeAt(0)] = 63;
        function getLens(b64) {
            var len = b64.length;
            if (len % 4 > 0) throw new Error('Invalid string. Length must be a multiple of 4');
            var validLen = b64.indexOf('=');
            if (-1 === validLen) validLen = len;
            var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
            return [
                validLen,
                placeHoldersLen
            ];
        }
        function byteLength(b64) {
            var lens = getLens(b64);
            var validLen = lens[0];
            var placeHoldersLen = lens[1];
            return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
        }
        function _byteLength(b64, validLen, placeHoldersLen) {
            return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
        }
        function toByteArray(b64) {
            var tmp;
            var lens = getLens(b64);
            var validLen = lens[0];
            var placeHoldersLen = lens[1];
            var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
            var curByte = 0;
            var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
            var i;
            for(i = 0; i < len; i += 4){
                tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
                arr[curByte++] = tmp >> 16 & 0xFF;
                arr[curByte++] = tmp >> 8 & 0xFF;
                arr[curByte++] = 0xFF & tmp;
            }
            if (2 === placeHoldersLen) {
                tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
                arr[curByte++] = 0xFF & tmp;
            }
            if (1 === placeHoldersLen) {
                tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
                arr[curByte++] = tmp >> 8 & 0xFF;
                arr[curByte++] = 0xFF & tmp;
            }
            return arr;
        }
        function tripletToBase64(num) {
            return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[0x3F & num];
        }
        function encodeChunk(uint8, start, end) {
            var tmp;
            var output = [];
            for(var i = start; i < end; i += 3){
                tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (0xFF & uint8[i + 2]);
                output.push(tripletToBase64(tmp));
            }
            return output.join('');
        }
        function fromByteArray(uint8) {
            var tmp;
            var len = uint8.length;
            var extraBytes = len % 3;
            var parts = [];
            var maxChunkLength = 16383;
            for(var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength)parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
            if (1 === extraBytes) {
                tmp = uint8[len - 1];
                parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==');
            } else if (2 === extraBytes) {
                tmp = (uint8[len - 2] << 8) + uint8[len - 1];
                parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=');
            }
            return parts.join('');
        }
    },
    287 (__unused_rspack_module, exports1, __webpack_require__) {
        "use strict";
        /*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */ var base64 = __webpack_require__(526);
        var ieee754 = __webpack_require__(251);
        var customInspectSymbol = 'function' == typeof Symbol && 'function' == typeof Symbol['for'] ? Symbol['for']('nodejs.util.inspect.custom') : null;
        exports1.hp = Buffer;
        exports1.IS = 50;
        var K_MAX_LENGTH = 0x7fffffff;
        Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
        if (!Buffer.TYPED_ARRAY_SUPPORT && "u" > typeof console && 'function' == typeof console.error) console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
        function typedArraySupport() {
            try {
                var arr = new Uint8Array(1);
                var proto = {
                    foo: function() {
                        return 42;
                    }
                };
                Object.setPrototypeOf(proto, Uint8Array.prototype);
                Object.setPrototypeOf(arr, proto);
                return 42 === arr.foo();
            } catch (e) {
                return false;
            }
        }
        Object.defineProperty(Buffer.prototype, 'parent', {
            enumerable: true,
            get: function() {
                if (!Buffer.isBuffer(this)) return;
                return this.buffer;
            }
        });
        Object.defineProperty(Buffer.prototype, 'offset', {
            enumerable: true,
            get: function() {
                if (!Buffer.isBuffer(this)) return;
                return this.byteOffset;
            }
        });
        function createBuffer(length) {
            if (length > K_MAX_LENGTH) throw new RangeError('The value "' + length + '" is invalid for option "size"');
            var buf = new Uint8Array(length);
            Object.setPrototypeOf(buf, Buffer.prototype);
            return buf;
        }
        function Buffer(arg, encodingOrOffset, length) {
            if ('number' == typeof arg) {
                if ('string' == typeof encodingOrOffset) throw new TypeError('The "string" argument must be of type string. Received type number');
                return allocUnsafe(arg);
            }
            return from(arg, encodingOrOffset, length);
        }
        Buffer.poolSize = 8192;
        function from(value, encodingOrOffset, length) {
            if ('string' == typeof value) return fromString(value, encodingOrOffset);
            if (ArrayBuffer.isView(value)) return fromArrayView(value);
            if (null == value) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
            if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) return fromArrayBuffer(value, encodingOrOffset, length);
            if ("u" > typeof SharedArrayBuffer && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) return fromArrayBuffer(value, encodingOrOffset, length);
            if ('number' == typeof value) throw new TypeError('The "value" argument must not be of type number. Received type number');
            var valueOf = value.valueOf && value.valueOf();
            if (null != valueOf && valueOf !== value) return Buffer.from(valueOf, encodingOrOffset, length);
            var b = fromObject(value);
            if (b) return b;
            if ("u" > typeof Symbol && null != Symbol.toPrimitive && 'function' == typeof value[Symbol.toPrimitive]) return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length);
            throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
        }
        Buffer.from = function(value, encodingOrOffset, length) {
            return from(value, encodingOrOffset, length);
        };
        Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
        Object.setPrototypeOf(Buffer, Uint8Array);
        function assertSize(size) {
            if ('number' != typeof size) throw new TypeError('"size" argument must be of type number');
            if (size < 0) throw new RangeError('The value "' + size + '" is invalid for option "size"');
        }
        function alloc(size, fill, encoding) {
            assertSize(size);
            if (size <= 0) return createBuffer(size);
            if (void 0 !== fill) return 'string' == typeof encoding ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
            return createBuffer(size);
        }
        Buffer.alloc = function(size, fill, encoding) {
            return alloc(size, fill, encoding);
        };
        function allocUnsafe(size) {
            assertSize(size);
            return createBuffer(size < 0 ? 0 : 0 | checked(size));
        }
        Buffer.allocUnsafe = function(size) {
            return allocUnsafe(size);
        };
        Buffer.allocUnsafeSlow = function(size) {
            return allocUnsafe(size);
        };
        function fromString(string, encoding) {
            if ('string' != typeof encoding || '' === encoding) encoding = 'utf8';
            if (!Buffer.isEncoding(encoding)) throw new TypeError('Unknown encoding: ' + encoding);
            var length = 0 | byteLength(string, encoding);
            var buf = createBuffer(length);
            var actual = buf.write(string, encoding);
            if (actual !== length) buf = buf.slice(0, actual);
            return buf;
        }
        function fromArrayLike(array) {
            var length = array.length < 0 ? 0 : 0 | checked(array.length);
            var buf = createBuffer(length);
            for(var i = 0; i < length; i += 1)buf[i] = 255 & array[i];
            return buf;
        }
        function fromArrayView(arrayView) {
            if (isInstance(arrayView, Uint8Array)) {
                var copy = new Uint8Array(arrayView);
                return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
            }
            return fromArrayLike(arrayView);
        }
        function fromArrayBuffer(array, byteOffset, length) {
            if (byteOffset < 0 || array.byteLength < byteOffset) throw new RangeError('"offset" is outside of buffer bounds');
            if (array.byteLength < byteOffset + (length || 0)) throw new RangeError('"length" is outside of buffer bounds');
            var buf;
            buf = void 0 === byteOffset && void 0 === length ? new Uint8Array(array) : void 0 === length ? new Uint8Array(array, byteOffset) : new Uint8Array(array, byteOffset, length);
            Object.setPrototypeOf(buf, Buffer.prototype);
            return buf;
        }
        function fromObject(obj) {
            if (Buffer.isBuffer(obj)) {
                var len = 0 | checked(obj.length);
                var buf = createBuffer(len);
                if (0 === buf.length) return buf;
                obj.copy(buf, 0, 0, len);
                return buf;
            }
            if (void 0 !== obj.length) {
                if ('number' != typeof obj.length || numberIsNaN(obj.length)) return createBuffer(0);
                return fromArrayLike(obj);
            }
            if ('Buffer' === obj.type && Array.isArray(obj.data)) return fromArrayLike(obj.data);
        }
        function checked(length) {
            if (length >= K_MAX_LENGTH) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + ' bytes');
            return 0 | length;
        }
        Buffer.isBuffer = function(b) {
            return null != b && true === b._isBuffer && b !== Buffer.prototype;
        };
        Buffer.compare = function(a, b) {
            if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
            if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);
            if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
            if (a === b) return 0;
            var x = a.length;
            var y = b.length;
            for(var i = 0, len = Math.min(x, y); i < len; ++i)if (a[i] !== b[i]) {
                x = a[i];
                y = b[i];
                break;
            }
            if (x < y) return -1;
            if (y < x) return 1;
            return 0;
        };
        Buffer.isEncoding = function(encoding) {
            switch(String(encoding).toLowerCase()){
                case 'hex':
                case 'utf8':
                case 'utf-8':
                case 'ascii':
                case 'latin1':
                case 'binary':
                case 'base64':
                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                    return true;
                default:
                    return false;
            }
        };
        Buffer.concat = function(list, length) {
            if (!Array.isArray(list)) throw new TypeError('"list" argument must be an Array of Buffers');
            if (0 === list.length) return Buffer.alloc(0);
            var i;
            if (void 0 === length) {
                length = 0;
                for(i = 0; i < list.length; ++i)length += list[i].length;
            }
            var buffer = Buffer.allocUnsafe(length);
            var pos = 0;
            for(i = 0; i < list.length; ++i){
                var buf = list[i];
                if (isInstance(buf, Uint8Array)) if (pos + buf.length > buffer.length) Buffer.from(buf).copy(buffer, pos);
                else Uint8Array.prototype.set.call(buffer, buf, pos);
                else if (Buffer.isBuffer(buf)) buf.copy(buffer, pos);
                else throw new TypeError('"list" argument must be an Array of Buffers');
                pos += buf.length;
            }
            return buffer;
        };
        function byteLength(string, encoding) {
            if (Buffer.isBuffer(string)) return string.length;
            if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) return string.byteLength;
            if ('string' != typeof string) throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string);
            var len = string.length;
            var mustMatch = arguments.length > 2 && true === arguments[2];
            if (!mustMatch && 0 === len) return 0;
            var loweredCase = false;
            for(;;)switch(encoding){
                case 'ascii':
                case 'latin1':
                case 'binary':
                    return len;
                case 'utf8':
                case 'utf-8':
                    return utf8ToBytes(string).length;
                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                    return 2 * len;
                case 'hex':
                    return len >>> 1;
                case 'base64':
                    return base64ToBytes(string).length;
                default:
                    if (loweredCase) return mustMatch ? -1 : utf8ToBytes(string).length;
                    encoding = ('' + encoding).toLowerCase();
                    loweredCase = true;
            }
        }
        Buffer.byteLength = byteLength;
        function slowToString(encoding, start, end) {
            var loweredCase = false;
            if (void 0 === start || start < 0) start = 0;
            if (start > this.length) return '';
            if (void 0 === end || end > this.length) end = this.length;
            if (end <= 0) return '';
            end >>>= 0;
            start >>>= 0;
            if (end <= start) return '';
            if (!encoding) encoding = 'utf8';
            while(true)switch(encoding){
                case 'hex':
                    return hexSlice(this, start, end);
                case 'utf8':
                case 'utf-8':
                    return utf8Slice(this, start, end);
                case 'ascii':
                    return asciiSlice(this, start, end);
                case 'latin1':
                case 'binary':
                    return latin1Slice(this, start, end);
                case 'base64':
                    return base64Slice(this, start, end);
                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                    return utf16leSlice(this, start, end);
                default:
                    if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
                    encoding = (encoding + '').toLowerCase();
                    loweredCase = true;
            }
        }
        Buffer.prototype._isBuffer = true;
        function swap(b, n, m) {
            var i = b[n];
            b[n] = b[m];
            b[m] = i;
        }
        Buffer.prototype.swap16 = function() {
            var len = this.length;
            if (len % 2 !== 0) throw new RangeError('Buffer size must be a multiple of 16-bits');
            for(var i = 0; i < len; i += 2)swap(this, i, i + 1);
            return this;
        };
        Buffer.prototype.swap32 = function() {
            var len = this.length;
            if (len % 4 !== 0) throw new RangeError('Buffer size must be a multiple of 32-bits');
            for(var i = 0; i < len; i += 4){
                swap(this, i, i + 3);
                swap(this, i + 1, i + 2);
            }
            return this;
        };
        Buffer.prototype.swap64 = function() {
            var len = this.length;
            if (len % 8 !== 0) throw new RangeError('Buffer size must be a multiple of 64-bits');
            for(var i = 0; i < len; i += 8){
                swap(this, i, i + 7);
                swap(this, i + 1, i + 6);
                swap(this, i + 2, i + 5);
                swap(this, i + 3, i + 4);
            }
            return this;
        };
        Buffer.prototype.toString = function() {
            var length = this.length;
            if (0 === length) return '';
            if (0 === arguments.length) return utf8Slice(this, 0, length);
            return slowToString.apply(this, arguments);
        };
        Buffer.prototype.toLocaleString = Buffer.prototype.toString;
        Buffer.prototype.equals = function(b) {
            if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
            if (this === b) return true;
            return 0 === Buffer.compare(this, b);
        };
        Buffer.prototype.inspect = function() {
            var str = '';
            var max = exports1.IS;
            str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim();
            if (this.length > max) str += ' ... ';
            return '<Buffer ' + str + '>';
        };
        if (customInspectSymbol) Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
        Buffer.prototype.compare = function(target, start, end, thisStart, thisEnd) {
            if (isInstance(target, Uint8Array)) target = Buffer.from(target, target.offset, target.byteLength);
            if (!Buffer.isBuffer(target)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target);
            if (void 0 === start) start = 0;
            if (void 0 === end) end = target ? target.length : 0;
            if (void 0 === thisStart) thisStart = 0;
            if (void 0 === thisEnd) thisEnd = this.length;
            if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) throw new RangeError('out of range index');
            if (thisStart >= thisEnd && start >= end) return 0;
            if (thisStart >= thisEnd) return -1;
            if (start >= end) return 1;
            start >>>= 0;
            end >>>= 0;
            thisStart >>>= 0;
            thisEnd >>>= 0;
            if (this === target) return 0;
            var x = thisEnd - thisStart;
            var y = end - start;
            var len = Math.min(x, y);
            var thisCopy = this.slice(thisStart, thisEnd);
            var targetCopy = target.slice(start, end);
            for(var i = 0; i < len; ++i)if (thisCopy[i] !== targetCopy[i]) {
                x = thisCopy[i];
                y = targetCopy[i];
                break;
            }
            if (x < y) return -1;
            if (y < x) return 1;
            return 0;
        };
        function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
            if (0 === buffer.length) return -1;
            if ('string' == typeof byteOffset) {
                encoding = byteOffset;
                byteOffset = 0;
            } else if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff;
            else if (byteOffset < -2147483648) byteOffset = -2147483648;
            byteOffset *= 1;
            if (numberIsNaN(byteOffset)) byteOffset = dir ? 0 : buffer.length - 1;
            if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
            if (byteOffset >= buffer.length) if (dir) return -1;
            else byteOffset = buffer.length - 1;
            else if (byteOffset < 0) if (!dir) return -1;
            else byteOffset = 0;
            if ('string' == typeof val) val = Buffer.from(val, encoding);
            if (Buffer.isBuffer(val)) {
                if (0 === val.length) return -1;
                return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
            }
            if ('number' == typeof val) {
                val &= 0xFF;
                if ('function' == typeof Uint8Array.prototype.indexOf) if (dir) return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
                else return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
                return arrayIndexOf(buffer, [
                    val
                ], byteOffset, encoding, dir);
            }
            throw new TypeError('val must be string, number or Buffer');
        }
        function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
            var indexSize = 1;
            var arrLength = arr.length;
            var valLength = val.length;
            if (void 0 !== encoding) {
                encoding = String(encoding).toLowerCase();
                if ('ucs2' === encoding || 'ucs-2' === encoding || 'utf16le' === encoding || 'utf-16le' === encoding) {
                    if (arr.length < 2 || val.length < 2) return -1;
                    indexSize = 2;
                    arrLength /= 2;
                    valLength /= 2;
                    byteOffset /= 2;
                }
            }
            function read(buf, i) {
                if (1 === indexSize) return buf[i];
                return buf.readUInt16BE(i * indexSize);
            }
            var i;
            if (dir) {
                var foundIndex = -1;
                for(i = byteOffset; i < arrLength; i++)if (read(arr, i) === read(val, -1 === foundIndex ? 0 : i - foundIndex)) {
                    if (-1 === foundIndex) foundIndex = i;
                    if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
                } else {
                    if (-1 !== foundIndex) i -= i - foundIndex;
                    foundIndex = -1;
                }
            } else {
                if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
                for(i = byteOffset; i >= 0; i--){
                    var found = true;
                    for(var j = 0; j < valLength; j++)if (read(arr, i + j) !== read(val, j)) {
                        found = false;
                        break;
                    }
                    if (found) return i;
                }
            }
            return -1;
        }
        Buffer.prototype.includes = function(val, byteOffset, encoding) {
            return -1 !== this.indexOf(val, byteOffset, encoding);
        };
        Buffer.prototype.indexOf = function(val, byteOffset, encoding) {
            return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
        };
        Buffer.prototype.lastIndexOf = function(val, byteOffset, encoding) {
            return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
        };
        function hexWrite(buf, string, offset, length) {
            offset = Number(offset) || 0;
            var remaining = buf.length - offset;
            if (length) {
                length = Number(length);
                if (length > remaining) length = remaining;
            } else length = remaining;
            var strLen = string.length;
            if (length > strLen / 2) length = strLen / 2;
            for(var i = 0; i < length; ++i){
                var parsed = parseInt(string.substr(2 * i, 2), 16);
                if (numberIsNaN(parsed)) break;
                buf[offset + i] = parsed;
            }
            return i;
        }
        function utf8Write(buf, string, offset, length) {
            return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
        }
        function asciiWrite(buf, string, offset, length) {
            return blitBuffer(asciiToBytes(string), buf, offset, length);
        }
        function base64Write(buf, string, offset, length) {
            return blitBuffer(base64ToBytes(string), buf, offset, length);
        }
        function ucs2Write(buf, string, offset, length) {
            return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
        }
        Buffer.prototype.write = function(string, offset, length, encoding) {
            if (void 0 === offset) {
                encoding = 'utf8';
                length = this.length;
                offset = 0;
            } else if (void 0 === length && 'string' == typeof offset) {
                encoding = offset;
                length = this.length;
                offset = 0;
            } else if (isFinite(offset)) {
                offset >>>= 0;
                if (isFinite(length)) {
                    length >>>= 0;
                    if (void 0 === encoding) encoding = 'utf8';
                } else {
                    encoding = length;
                    length = void 0;
                }
            } else throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
            var remaining = this.length - offset;
            if (void 0 === length || length > remaining) length = remaining;
            if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) throw new RangeError('Attempt to write outside buffer bounds');
            if (!encoding) encoding = 'utf8';
            var loweredCase = false;
            for(;;)switch(encoding){
                case 'hex':
                    return hexWrite(this, string, offset, length);
                case 'utf8':
                case 'utf-8':
                    return utf8Write(this, string, offset, length);
                case 'ascii':
                case 'latin1':
                case 'binary':
                    return asciiWrite(this, string, offset, length);
                case 'base64':
                    return base64Write(this, string, offset, length);
                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                    return ucs2Write(this, string, offset, length);
                default:
                    if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
                    encoding = ('' + encoding).toLowerCase();
                    loweredCase = true;
            }
        };
        Buffer.prototype.toJSON = function() {
            return {
                type: 'Buffer',
                data: Array.prototype.slice.call(this._arr || this, 0)
            };
        };
        function base64Slice(buf, start, end) {
            if (0 === start && end === buf.length) return base64.fromByteArray(buf);
            return base64.fromByteArray(buf.slice(start, end));
        }
        function utf8Slice(buf, start, end) {
            end = Math.min(buf.length, end);
            var res = [];
            var i = start;
            while(i < end){
                var firstByte = buf[i];
                var codePoint = null;
                var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;
                if (i + bytesPerSequence <= end) {
                    var secondByte, thirdByte, fourthByte, tempCodePoint;
                    switch(bytesPerSequence){
                        case 1:
                            if (firstByte < 0x80) codePoint = firstByte;
                            break;
                        case 2:
                            secondByte = buf[i + 1];
                            if ((0xC0 & secondByte) === 0x80) {
                                tempCodePoint = (0x1F & firstByte) << 0x6 | 0x3F & secondByte;
                                if (tempCodePoint > 0x7F) codePoint = tempCodePoint;
                            }
                            break;
                        case 3:
                            secondByte = buf[i + 1];
                            thirdByte = buf[i + 2];
                            if ((0xC0 & secondByte) === 0x80 && (0xC0 & thirdByte) === 0x80) {
                                tempCodePoint = (0xF & firstByte) << 0xC | (0x3F & secondByte) << 0x6 | 0x3F & thirdByte;
                                if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) codePoint = tempCodePoint;
                            }
                            break;
                        case 4:
                            secondByte = buf[i + 1];
                            thirdByte = buf[i + 2];
                            fourthByte = buf[i + 3];
                            if ((0xC0 & secondByte) === 0x80 && (0xC0 & thirdByte) === 0x80 && (0xC0 & fourthByte) === 0x80) {
                                tempCodePoint = (0xF & firstByte) << 0x12 | (0x3F & secondByte) << 0xC | (0x3F & thirdByte) << 0x6 | 0x3F & fourthByte;
                                if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) codePoint = tempCodePoint;
                            }
                    }
                }
                if (null === codePoint) {
                    codePoint = 0xFFFD;
                    bytesPerSequence = 1;
                } else if (codePoint > 0xFFFF) {
                    codePoint -= 0x10000;
                    res.push(codePoint >>> 10 & 0x3FF | 0xD800);
                    codePoint = 0xDC00 | 0x3FF & codePoint;
                }
                res.push(codePoint);
                i += bytesPerSequence;
            }
            return decodeCodePointsArray(res);
        }
        var MAX_ARGUMENTS_LENGTH = 0x1000;
        function decodeCodePointsArray(codePoints) {
            var len = codePoints.length;
            if (len <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode.apply(String, codePoints);
            var res = '';
            var i = 0;
            while(i < len)res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
            return res;
        }
        function asciiSlice(buf, start, end) {
            var ret = '';
            end = Math.min(buf.length, end);
            for(var i = start; i < end; ++i)ret += String.fromCharCode(0x7F & buf[i]);
            return ret;
        }
        function latin1Slice(buf, start, end) {
            var ret = '';
            end = Math.min(buf.length, end);
            for(var i = start; i < end; ++i)ret += String.fromCharCode(buf[i]);
            return ret;
        }
        function hexSlice(buf, start, end) {
            var len = buf.length;
            if (!start || start < 0) start = 0;
            if (!end || end < 0 || end > len) end = len;
            var out = '';
            for(var i = start; i < end; ++i)out += hexSliceLookupTable[buf[i]];
            return out;
        }
        function utf16leSlice(buf, start, end) {
            var bytes = buf.slice(start, end);
            var res = '';
            for(var i = 0; i < bytes.length - 1; i += 2)res += String.fromCharCode(bytes[i] + 256 * bytes[i + 1]);
            return res;
        }
        Buffer.prototype.slice = function(start, end) {
            var len = this.length;
            start = ~~start;
            end = void 0 === end ? len : ~~end;
            if (start < 0) {
                start += len;
                if (start < 0) start = 0;
            } else if (start > len) start = len;
            if (end < 0) {
                end += len;
                if (end < 0) end = 0;
            } else if (end > len) end = len;
            if (end < start) end = start;
            var newBuf = this.subarray(start, end);
            Object.setPrototypeOf(newBuf, Buffer.prototype);
            return newBuf;
        };
        function checkOffset(offset, ext, length) {
            if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
            if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
        }
        Buffer.prototype.readUintLE = Buffer.prototype.readUIntLE = function(offset, byteLength, noAssert) {
            offset >>>= 0;
            byteLength >>>= 0;
            if (!noAssert) checkOffset(offset, byteLength, this.length);
            var val = this[offset];
            var mul = 1;
            var i = 0;
            while(++i < byteLength && (mul *= 0x100))val += this[offset + i] * mul;
            return val;
        };
        Buffer.prototype.readUintBE = Buffer.prototype.readUIntBE = function(offset, byteLength, noAssert) {
            offset >>>= 0;
            byteLength >>>= 0;
            if (!noAssert) checkOffset(offset, byteLength, this.length);
            var val = this[offset + --byteLength];
            var mul = 1;
            while(byteLength > 0 && (mul *= 0x100))val += this[offset + --byteLength] * mul;
            return val;
        };
        Buffer.prototype.readUint8 = Buffer.prototype.readUInt8 = function(offset, noAssert) {
            offset >>>= 0;
            if (!noAssert) checkOffset(offset, 1, this.length);
            return this[offset];
        };
        Buffer.prototype.readUint16LE = Buffer.prototype.readUInt16LE = function(offset, noAssert) {
            offset >>>= 0;
            if (!noAssert) checkOffset(offset, 2, this.length);
            return this[offset] | this[offset + 1] << 8;
        };
        Buffer.prototype.readUint16BE = Buffer.prototype.readUInt16BE = function(offset, noAssert) {
            offset >>>= 0;
            if (!noAssert) checkOffset(offset, 2, this.length);
            return this[offset] << 8 | this[offset + 1];
        };
        Buffer.prototype.readUint32LE = Buffer.prototype.readUInt32LE = function(offset, noAssert) {
            offset >>>= 0;
            if (!noAssert) checkOffset(offset, 4, this.length);
            return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + 0x1000000 * this[offset + 3];
        };
        Buffer.prototype.readUint32BE = Buffer.prototype.readUInt32BE = function(offset, noAssert) {
            offset >>>= 0;
            if (!noAssert) checkOffset(offset, 4, this.length);
            return 0x1000000 * this[offset] + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
        };
        Buffer.prototype.readIntLE = function(offset, byteLength, noAssert) {
            offset >>>= 0;
            byteLength >>>= 0;
            if (!noAssert) checkOffset(offset, byteLength, this.length);
            var val = this[offset];
            var mul = 1;
            var i = 0;
            while(++i < byteLength && (mul *= 0x100))val += this[offset + i] * mul;
            mul *= 0x80;
            if (val >= mul) val -= Math.pow(2, 8 * byteLength);
            return val;
        };
        Buffer.prototype.readIntBE = function(offset, byteLength, noAssert) {
            offset >>>= 0;
            byteLength >>>= 0;
            if (!noAssert) checkOffset(offset, byteLength, this.length);
            var i = byteLength;
            var mul = 1;
            var val = this[offset + --i];
            while(i > 0 && (mul *= 0x100))val += this[offset + --i] * mul;
            mul *= 0x80;
            if (val >= mul) val -= Math.pow(2, 8 * byteLength);
            return val;
        };
        Buffer.prototype.readInt8 = function(offset, noAssert) {
            offset >>>= 0;
            if (!noAssert) checkOffset(offset, 1, this.length);
            if (!(0x80 & this[offset])) return this[offset];
            return (0xff - this[offset] + 1) * -1;
        };
        Buffer.prototype.readInt16LE = function(offset, noAssert) {
            offset >>>= 0;
            if (!noAssert) checkOffset(offset, 2, this.length);
            var val = this[offset] | this[offset + 1] << 8;
            return 0x8000 & val ? 0xFFFF0000 | val : val;
        };
        Buffer.prototype.readInt16BE = function(offset, noAssert) {
            offset >>>= 0;
            if (!noAssert) checkOffset(offset, 2, this.length);
            var val = this[offset + 1] | this[offset] << 8;
            return 0x8000 & val ? 0xFFFF0000 | val : val;
        };
        Buffer.prototype.readInt32LE = function(offset, noAssert) {
            offset >>>= 0;
            if (!noAssert) checkOffset(offset, 4, this.length);
            return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
        };
        Buffer.prototype.readInt32BE = function(offset, noAssert) {
            offset >>>= 0;
            if (!noAssert) checkOffset(offset, 4, this.length);
            return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
        };
        Buffer.prototype.readFloatLE = function(offset, noAssert) {
            offset >>>= 0;
            if (!noAssert) checkOffset(offset, 4, this.length);
            return ieee754.read(this, offset, true, 23, 4);
        };
        Buffer.prototype.readFloatBE = function(offset, noAssert) {
            offset >>>= 0;
            if (!noAssert) checkOffset(offset, 4, this.length);
            return ieee754.read(this, offset, false, 23, 4);
        };
        Buffer.prototype.readDoubleLE = function(offset, noAssert) {
            offset >>>= 0;
            if (!noAssert) checkOffset(offset, 8, this.length);
            return ieee754.read(this, offset, true, 52, 8);
        };
        Buffer.prototype.readDoubleBE = function(offset, noAssert) {
            offset >>>= 0;
            if (!noAssert) checkOffset(offset, 8, this.length);
            return ieee754.read(this, offset, false, 52, 8);
        };
        function checkInt(buf, value, offset, ext, max, min) {
            if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
            if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
            if (offset + ext > buf.length) throw new RangeError('Index out of range');
        }
        Buffer.prototype.writeUintLE = Buffer.prototype.writeUIntLE = function(value, offset, byteLength, noAssert) {
            value *= 1;
            offset >>>= 0;
            byteLength >>>= 0;
            if (!noAssert) {
                var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                checkInt(this, value, offset, byteLength, maxBytes, 0);
            }
            var mul = 1;
            var i = 0;
            this[offset] = 0xFF & value;
            while(++i < byteLength && (mul *= 0x100))this[offset + i] = value / mul & 0xFF;
            return offset + byteLength;
        };
        Buffer.prototype.writeUintBE = Buffer.prototype.writeUIntBE = function(value, offset, byteLength, noAssert) {
            value *= 1;
            offset >>>= 0;
            byteLength >>>= 0;
            if (!noAssert) {
                var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                checkInt(this, value, offset, byteLength, maxBytes, 0);
            }
            var i = byteLength - 1;
            var mul = 1;
            this[offset + i] = 0xFF & value;
            while(--i >= 0 && (mul *= 0x100))this[offset + i] = value / mul & 0xFF;
            return offset + byteLength;
        };
        Buffer.prototype.writeUint8 = Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
            value *= 1;
            offset >>>= 0;
            if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
            this[offset] = 0xff & value;
            return offset + 1;
        };
        Buffer.prototype.writeUint16LE = Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
            value *= 1;
            offset >>>= 0;
            if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
            this[offset] = 0xff & value;
            this[offset + 1] = value >>> 8;
            return offset + 2;
        };
        Buffer.prototype.writeUint16BE = Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
            value *= 1;
            offset >>>= 0;
            if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
            this[offset] = value >>> 8;
            this[offset + 1] = 0xff & value;
            return offset + 2;
        };
        Buffer.prototype.writeUint32LE = Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
            value *= 1;
            offset >>>= 0;
            if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
            this[offset + 3] = value >>> 24;
            this[offset + 2] = value >>> 16;
            this[offset + 1] = value >>> 8;
            this[offset] = 0xff & value;
            return offset + 4;
        };
        Buffer.prototype.writeUint32BE = Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
            value *= 1;
            offset >>>= 0;
            if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
            this[offset] = value >>> 24;
            this[offset + 1] = value >>> 16;
            this[offset + 2] = value >>> 8;
            this[offset + 3] = 0xff & value;
            return offset + 4;
        };
        Buffer.prototype.writeIntLE = function(value, offset, byteLength, noAssert) {
            value *= 1;
            offset >>>= 0;
            if (!noAssert) {
                var limit = Math.pow(2, 8 * byteLength - 1);
                checkInt(this, value, offset, byteLength, limit - 1, -limit);
            }
            var i = 0;
            var mul = 1;
            var sub = 0;
            this[offset] = 0xFF & value;
            while(++i < byteLength && (mul *= 0x100)){
                if (value < 0 && 0 === sub && 0 !== this[offset + i - 1]) sub = 1;
                this[offset + i] = (value / mul | 0) - sub & 0xFF;
            }
            return offset + byteLength;
        };
        Buffer.prototype.writeIntBE = function(value, offset, byteLength, noAssert) {
            value *= 1;
            offset >>>= 0;
            if (!noAssert) {
                var limit = Math.pow(2, 8 * byteLength - 1);
                checkInt(this, value, offset, byteLength, limit - 1, -limit);
            }
            var i = byteLength - 1;
            var mul = 1;
            var sub = 0;
            this[offset + i] = 0xFF & value;
            while(--i >= 0 && (mul *= 0x100)){
                if (value < 0 && 0 === sub && 0 !== this[offset + i + 1]) sub = 1;
                this[offset + i] = (value / mul | 0) - sub & 0xFF;
            }
            return offset + byteLength;
        };
        Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
            value *= 1;
            offset >>>= 0;
            if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -128);
            if (value < 0) value = 0xff + value + 1;
            this[offset] = 0xff & value;
            return offset + 1;
        };
        Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
            value *= 1;
            offset >>>= 0;
            if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -32768);
            this[offset] = 0xff & value;
            this[offset + 1] = value >>> 8;
            return offset + 2;
        };
        Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
            value *= 1;
            offset >>>= 0;
            if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -32768);
            this[offset] = value >>> 8;
            this[offset + 1] = 0xff & value;
            return offset + 2;
        };
        Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
            value *= 1;
            offset >>>= 0;
            if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -2147483648);
            this[offset] = 0xff & value;
            this[offset + 1] = value >>> 8;
            this[offset + 2] = value >>> 16;
            this[offset + 3] = value >>> 24;
            return offset + 4;
        };
        Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
            value *= 1;
            offset >>>= 0;
            if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -2147483648);
            if (value < 0) value = 0xffffffff + value + 1;
            this[offset] = value >>> 24;
            this[offset + 1] = value >>> 16;
            this[offset + 2] = value >>> 8;
            this[offset + 3] = 0xff & value;
            return offset + 4;
        };
        function checkIEEE754(buf, value, offset, ext, max, min) {
            if (offset + ext > buf.length) throw new RangeError('Index out of range');
            if (offset < 0) throw new RangeError('Index out of range');
        }
        function writeFloat(buf, value, offset, littleEndian, noAssert) {
            value *= 1;
            offset >>>= 0;
            if (!noAssert) checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
            ieee754.write(buf, value, offset, littleEndian, 23, 4);
            return offset + 4;
        }
        Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
            return writeFloat(this, value, offset, true, noAssert);
        };
        Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
            return writeFloat(this, value, offset, false, noAssert);
        };
        function writeDouble(buf, value, offset, littleEndian, noAssert) {
            value *= 1;
            offset >>>= 0;
            if (!noAssert) checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157e+308);
            ieee754.write(buf, value, offset, littleEndian, 52, 8);
            return offset + 8;
        }
        Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
            return writeDouble(this, value, offset, true, noAssert);
        };
        Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
            return writeDouble(this, value, offset, false, noAssert);
        };
        Buffer.prototype.copy = function(target, targetStart, start, end) {
            if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer');
            if (!start) start = 0;
            if (!end && 0 !== end) end = this.length;
            if (targetStart >= target.length) targetStart = target.length;
            if (!targetStart) targetStart = 0;
            if (end > 0 && end < start) end = start;
            if (end === start) return 0;
            if (0 === target.length || 0 === this.length) return 0;
            if (targetStart < 0) throw new RangeError('targetStart out of bounds');
            if (start < 0 || start >= this.length) throw new RangeError('Index out of range');
            if (end < 0) throw new RangeError('sourceEnd out of bounds');
            if (end > this.length) end = this.length;
            if (target.length - targetStart < end - start) end = target.length - targetStart + start;
            var len = end - start;
            if (this === target && 'function' == typeof Uint8Array.prototype.copyWithin) this.copyWithin(targetStart, start, end);
            else Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
            return len;
        };
        Buffer.prototype.fill = function(val, start, end, encoding) {
            if ('string' == typeof val) {
                if ('string' == typeof start) {
                    encoding = start;
                    start = 0;
                    end = this.length;
                } else if ('string' == typeof end) {
                    encoding = end;
                    end = this.length;
                }
                if (void 0 !== encoding && 'string' != typeof encoding) throw new TypeError('encoding must be a string');
                if ('string' == typeof encoding && !Buffer.isEncoding(encoding)) throw new TypeError('Unknown encoding: ' + encoding);
                if (1 === val.length) {
                    var code = val.charCodeAt(0);
                    if ('utf8' === encoding && code < 128 || 'latin1' === encoding) val = code;
                }
            } else if ('number' == typeof val) val &= 255;
            else if ('boolean' == typeof val) val = Number(val);
            if (start < 0 || this.length < start || this.length < end) throw new RangeError('Out of range index');
            if (end <= start) return this;
            start >>>= 0;
            end = void 0 === end ? this.length : end >>> 0;
            if (!val) val = 0;
            var i;
            if ('number' == typeof val) for(i = start; i < end; ++i)this[i] = val;
            else {
                var bytes = Buffer.isBuffer(val) ? val : Buffer.from(val, encoding);
                var len = bytes.length;
                if (0 === len) throw new TypeError('The value "' + val + '" is invalid for argument "value"');
                for(i = 0; i < end - start; ++i)this[i + start] = bytes[i % len];
            }
            return this;
        };
        var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
        function base64clean(str) {
            str = str.split('=')[0];
            str = str.trim().replace(INVALID_BASE64_RE, '');
            if (str.length < 2) return '';
            while(str.length % 4 !== 0)str += '=';
            return str;
        }
        function utf8ToBytes(string, units) {
            units = units || 1 / 0;
            var codePoint;
            var length = string.length;
            var leadSurrogate = null;
            var bytes = [];
            for(var i = 0; i < length; ++i){
                codePoint = string.charCodeAt(i);
                if (codePoint > 0xD7FF && codePoint < 0xE000) {
                    if (!leadSurrogate) {
                        if (codePoint > 0xDBFF) {
                            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                            continue;
                        }
                        if (i + 1 === length) {
                            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                            continue;
                        }
                        leadSurrogate = codePoint;
                        continue;
                    }
                    if (codePoint < 0xDC00) {
                        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                        leadSurrogate = codePoint;
                        continue;
                    }
                    codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
                } else if (leadSurrogate) {
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                }
                leadSurrogate = null;
                if (codePoint < 0x80) {
                    if ((units -= 1) < 0) break;
                    bytes.push(codePoint);
                } else if (codePoint < 0x800) {
                    if ((units -= 2) < 0) break;
                    bytes.push(codePoint >> 0x6 | 0xC0, 0x3F & codePoint | 0x80);
                } else if (codePoint < 0x10000) {
                    if ((units -= 3) < 0) break;
                    bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, 0x3F & codePoint | 0x80);
                } else if (codePoint < 0x110000) {
                    if ((units -= 4) < 0) break;
                    bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, 0x3F & codePoint | 0x80);
                } else throw new Error('Invalid code point');
            }
            return bytes;
        }
        function asciiToBytes(str) {
            var byteArray = [];
            for(var i = 0; i < str.length; ++i)byteArray.push(0xFF & str.charCodeAt(i));
            return byteArray;
        }
        function utf16leToBytes(str, units) {
            var c, hi, lo;
            var byteArray = [];
            for(var i = 0; i < str.length; ++i){
                if ((units -= 2) < 0) break;
                c = str.charCodeAt(i);
                hi = c >> 8;
                lo = c % 256;
                byteArray.push(lo);
                byteArray.push(hi);
            }
            return byteArray;
        }
        function base64ToBytes(str) {
            return base64.toByteArray(base64clean(str));
        }
        function blitBuffer(src, dst, offset, length) {
            for(var i = 0; i < length; ++i){
                if (i + offset >= dst.length || i >= src.length) break;
                dst[i + offset] = src[i];
            }
            return i;
        }
        function isInstance(obj, type) {
            return obj instanceof type || null != obj && null != obj.constructor && null != obj.constructor.name && obj.constructor.name === type.name;
        }
        function numberIsNaN(obj) {
            return obj !== obj;
        }
        var hexSliceLookupTable = function() {
            var alphabet = '0123456789abcdef';
            var table = new Array(256);
            for(var i = 0; i < 16; ++i){
                var i16 = 16 * i;
                for(var j = 0; j < 16; ++j)table[i16 + j] = alphabet[i] + alphabet[j];
            }
            return table;
        }();
    },
    251 (__unused_rspack_module, exports1) {
        /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */ exports1.read = function(buffer, offset, isLE, mLen, nBytes) {
            var e, m;
            var eLen = 8 * nBytes - mLen - 1;
            var eMax = (1 << eLen) - 1;
            var eBias = eMax >> 1;
            var nBits = -7;
            var i = isLE ? nBytes - 1 : 0;
            var d = isLE ? -1 : 1;
            var s = buffer[offset + i];
            i += d;
            e = s & (1 << -nBits) - 1;
            s >>= -nBits;
            nBits += eLen;
            for(; nBits > 0; e = 256 * e + buffer[offset + i], i += d, nBits -= 8);
            m = e & (1 << -nBits) - 1;
            e >>= -nBits;
            nBits += mLen;
            for(; nBits > 0; m = 256 * m + buffer[offset + i], i += d, nBits -= 8);
            if (0 === e) e = 1 - eBias;
            else {
                if (e === eMax) return m ? NaN : 1 / 0 * (s ? -1 : 1);
                m += Math.pow(2, mLen);
                e -= eBias;
            }
            return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
        };
        exports1.write = function(buffer, value, offset, isLE, mLen, nBytes) {
            var e, m, c;
            var eLen = 8 * nBytes - mLen - 1;
            var eMax = (1 << eLen) - 1;
            var eBias = eMax >> 1;
            var rt = 23 === mLen ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
            var i = isLE ? 0 : nBytes - 1;
            var d = isLE ? 1 : -1;
            var s = value < 0 || 0 === value && 1 / value < 0 ? 1 : 0;
            value = Math.abs(value);
            if (isNaN(value) || value === 1 / 0) {
                m = isNaN(value) ? 1 : 0;
                e = eMax;
            } else {
                e = Math.floor(Math.log(value) / Math.LN2);
                if (value * (c = Math.pow(2, -e)) < 1) {
                    e--;
                    c *= 2;
                }
                if (e + eBias >= 1) value += rt / c;
                else value += rt * Math.pow(2, 1 - eBias);
                if (value * c >= 2) {
                    e++;
                    c /= 2;
                }
                if (e + eBias >= eMax) {
                    m = 0;
                    e = eMax;
                } else if (e + eBias >= 1) {
                    m = (value * c - 1) * Math.pow(2, mLen);
                    e += eBias;
                } else {
                    m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
                    e = 0;
                }
            }
            for(; mLen >= 8; buffer[offset + i] = 0xff & m, i += d, m /= 256, mLen -= 8);
            e = e << mLen | m;
            eLen += mLen;
            for(; eLen > 0; buffer[offset + i] = 0xff & e, i += d, e /= 256, eLen -= 8);
            buffer[offset + i - d] |= 128 * s;
        };
    },
    527 (module, __unused_rspack_exports, __webpack_require__) {
        var Buffer = __webpack_require__(287).hp;
        /*! typedarray-to-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */ module.exports = function(arr) {
            return ArrayBuffer.isView(arr) ? Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength) : Buffer.from(arr);
        };
    }
};
var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (void 0 !== cachedModule) return cachedModule.exports;
    var module = __webpack_module_cache__[moduleId] = {
        exports: {}
    };
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
}
(()=>{
    __webpack_require__.n = (module)=>{
        var getter = module && module.__esModule ? ()=>module['default'] : ()=>module;
        __webpack_require__.d(getter, {
            a: getter
        });
        return getter;
    };
})();
(()=>{
    __webpack_require__.d = (exports1, getters, values)=>{
        var define = (defs, kind)=>{
            for(var key in defs)if (__webpack_require__.o(defs, key) && !__webpack_require__.o(exports1, key)) Object.defineProperty(exports1, key, {
                enumerable: true,
                [kind]: defs[key]
            });
        };
        define(getters, "get");
        define(values, "value");
    };
})();
(()=>{
    __webpack_require__.o = (obj, prop)=>Object.prototype.hasOwnProperty.call(obj, prop);
})();
(()=>{
    __webpack_require__.r = (exports1)=>{
        if ("u" > typeof Symbol && Symbol.toStringTag) Object.defineProperty(exports1, Symbol.toStringTag, {
            value: 'Module'
        });
        Object.defineProperty(exports1, '__esModule', {
            value: true
        });
    };
})();
var __webpack_exports__ = {};
(()=>{
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    var typedarray_to_buffer__rspack_import_0 = __webpack_require__(527);
    var typedarray_to_buffer__rspack_import_0_default = /*#__PURE__*/ __webpack_require__.n(typedarray_to_buffer__rspack_import_0);
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
            return typedarray_to_buffer__rspack_import_0_default()(arr);
        }
        constructor(float32Array){
            _define_property(this, "float32Array", void 0);
            this.float32Array = float32Array;
        }
    }
    const __rspack_default_export = AudioSample;
    __webpack_require__.d(__webpack_exports__, {}, {
        default: __rspack_default_export
    });
})();
exports["default"] = __webpack_exports__["default"];
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});
