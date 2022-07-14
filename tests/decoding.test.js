import * as assert from "assert";
import {
    decodeFalse, decodeTrue,
    decodeString,
    decodeStringWithWeirdChar,
    decodeInteger,
    decodeNull,
    decodeFloat32, decodeFloat64,
    decodeObject,
    decodeArrayU8, decodeArray, decodeAllInArray, decodeBytes,
    decodeAllInObj, decodeNestedObjs,
    decodeArrayInArray
} from "../build/debug.js";

let result;

result = decodeFalse()
assert.equal(result, false)

result = decodeTrue()
assert.equal(result, true)

result = decodeNull()
assert.equal(result, true)

result = decodeInteger()
assert.equal(result, 1)

result = decodeFloat32()
assert.equal(result, 123123.109375)

result = decodeFloat64()
assert.equal(result, 11231241314.11111)

result = decodeString()
assert.equal(result, "test value")

result = decodeStringWithWeirdChar()
assert.equal(result, "zoé")

result = decodeObject()
assert.equal(result, true)

result = decodeArrayU8()
assert.equal(result, true)

result = decodeArray()
assert.equal(result, true)

result = decodeAllInObj()
assert.equal(result, true)

result = decodeNestedObjs()
assert.equal(result, true)

result = decodeAllInArray()
assert.equal(result, true)

result = decodeBytes()
assert.equal(result, true)

result = decodeArrayInArray()
assert.deepEqual(result, [100n])