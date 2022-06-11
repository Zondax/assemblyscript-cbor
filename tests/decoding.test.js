import * as assert from "assert";
import {
    decodeString,
    decodeInteger,
    decodeNull,
    decodeFloat32, decodeFloat64,
} from "../build/debug.js";

let result;

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
