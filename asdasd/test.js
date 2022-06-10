import cbor from "cbor-js"
var initial = { key1: 1, key2: 100 };
var encoded = cbor.encode(initial);
console.log(encoded)
