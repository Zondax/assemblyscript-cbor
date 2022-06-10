import * as assert from "assert";
import {
    encodeString, encodeFalse, encodeTrue, encodeNull, encodeUndefined,
    encodeUint8, encodeUint16, encodeUint32, encodeUint64,
    encodeArrayU8,
} from "../build/release.js";

function buf2hex(buffer) { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}

let result;

result = encodeString()
assert.equal("6a746573742076616c7565", buf2hex(result))

result = encodeFalse()
assert.equal("f4", buf2hex(result))

result = encodeTrue()
assert.equal("f5", buf2hex(result))

result = encodeNull()
assert.equal("f6", buf2hex(result))

result = encodeUndefined()
assert.equal("f7", buf2hex(result))

result = encodeUint8()
assert.equal("01", buf2hex(result))

result = encodeUint16()
assert.equal("0001", buf2hex(result))

result = encodeUint32()
assert.equal("00000001", buf2hex(result))

result = encodeUint64()
assert.equal("0000000000000001", buf2hex(result))

result = encodeArrayU8()
assert.equal("8501182b184218ea186f", buf2hex(result))
