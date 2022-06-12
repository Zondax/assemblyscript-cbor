import * as assert from "assert";
import {
    decodeFalse, decodeTrue,
    decodeString,
    decodeInteger,
    decodeNull,
    decodeFloat32, decodeFloat64,
    decodeObject,
    decodeArrayU8,
    decodeAll,
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

result = decodeObject()
assert.equal(result, true)

result = decodeArrayU8()
assert.equal(result, true)

result = decodeAll()
assert.equal(result, true)
