import * as assert from "assert";
import {
    encodeString, encodeFalse, encodeTrue, encodeNull, encodeUndefined,
    encodeUint8, encodeUint16, encodeUint32, encodeUint64,
    encodeArrayU8,
    encodeInt8, encodeInt16, encodeInt32, encodeInt64,
    encodeF32, encodeF64,
    encodeObject, encodeAllInObj, encodeNestedObjs, encodeArray, encodeAllInArray
} from "../build/debug.js";

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

result = encodeInt8()
assert.equal("3863", buf2hex(result))

result = encodeInt16()
assert.equal("39270f", buf2hex(result))

result = encodeInt32()
assert.equal("3a000f423f", buf2hex(result))

result = encodeInt64()
assert.equal("3a05f5e0ff", buf2hex(result))

result = encodeUint8()
assert.equal("01", buf2hex(result))

result = encodeUint16()
assert.equal("01", buf2hex(result))

result = encodeUint32()
assert.equal("01", buf2hex(result))

result = encodeUint64()
assert.equal("01", buf2hex(result))

result = encodeF32()
assert.equal("fb40fe0f31c0000000", buf2hex(result))

result = encodeF64()
assert.equal("fb4204eb792310e38e", buf2hex(result))

result = encodeArrayU8()
assert.equal("8501182b184218ea186f", buf2hex(result))

result = encodeObject()
assert.equal("a2646b65793101646b6579321864", buf2hex(result))

result = encodeAllInObj()
assert.equal("af6575696e743818846675696e74313619199a6675696e7433321a006401906675696e7436341b0000006792a7f0fa64696e7438387e65696e743136397b0b65696e7433323a0064018f65696e7436343b0000006792a7f0f967617272617955388501182b184218ea186f6a747275652d76616c7565f56b66616c73652d76616c7565f46a6e756c6c2d76616c7565f66f756e646566696e65642d76616c7565f763663634fb41a3de39df19999a63663332fb40f33a0520000000", buf2hex(result))

result = encodeNestedObjs()
assert.equal("a1646c766c31a1646c766c32a1646c766c33a1646c766c34a1646c766c351884", buf2hex(result))

result = encodeArray()
assert.equal("84646b65793101646b6579321864", buf2hex(result))

result = encodeAllInArray()
assert.equal("981f6575696e743818846675696e74313619199a6675696e7433321a006401906675696e7436341b0000006792a7f0fa64696e7438387e65696e743136397b0b65696e7433323a0064018f65696e7436343b0000006792a7f0f96a747275652d76616c7565f56b66616c73652d76616c7565f46a6e756c6c2d76616c7565f66f756e646566696e65642d76616c7565f763663634fb41a3de39df19999a63663332fb40f33a052000000067617272617955388501182b184218ea186fa265696e743136397b0b65696e743136397b0b", buf2hex(result))
