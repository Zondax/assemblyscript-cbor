import {CBOREncoder} from "./encoder";


export function encodeNull():ArrayBuffer {
    const encoder = new CBOREncoder()
    encoder.addNull()

    return encoder.serialize()
}

export function encodeUndefined():ArrayBuffer {
    const encoder = new CBOREncoder()
    encoder.addUndefined()

    return encoder.serialize()
}

export function encodeInt8():ArrayBuffer {
    const encoder = new CBOREncoder()
    encoder.addInt8(-100)

    return encoder.serialize()
}

export function encodeInt16():ArrayBuffer {
    const encoder = new CBOREncoder()
    encoder.addInt16(-10000)

    return encoder.serialize()
}

export function encodeInt32():ArrayBuffer {
    const encoder = new CBOREncoder()
    encoder.addInt32(-1000000)

    return encoder.serialize()
}

export function encodeInt64():ArrayBuffer {
    const encoder = new CBOREncoder()
    encoder.addInt64(-100000000)

    return encoder.serialize()
}

export function encodeUint8():ArrayBuffer {
    const encoder = new CBOREncoder()
    encoder.addUint8(1)

    return encoder.serialize()
}

export function encodeUint16():ArrayBuffer {
    const encoder = new CBOREncoder()
    encoder.addUint16(1)

    return encoder.serialize()
}

export function encodeUint32():ArrayBuffer {
    const encoder = new CBOREncoder()
    encoder.addUint32(1)

    return encoder.serialize()
}

export function encodeUint64():ArrayBuffer {
    const encoder = new CBOREncoder()
    encoder.addUint64(1)

    return encoder.serialize()
}

export function encodeF32():ArrayBuffer {
    const encoder = new CBOREncoder()
    encoder.addF32(123123.111111)

    return encoder.serialize()
}

export function encodeF64():ArrayBuffer {
    const encoder = new CBOREncoder()
    encoder.addF64(11231241314.111111)

    return encoder.serialize()
}

export function encodeString():ArrayBuffer {
    const encoder = new CBOREncoder()
    encoder.addString("test value")

    return encoder.serialize()
}

export function encodeStringWithWeirdChar():ArrayBuffer {
    const encoder = new CBOREncoder()
    encoder.addString("léa")

    return encoder.serialize()
}

export function encodeFalse():ArrayBuffer {
    const encoder = new CBOREncoder()
    encoder.addBoolean(false)

    return encoder.serialize()
}

export function encodeTrue():ArrayBuffer {
    const encoder = new CBOREncoder()
    encoder.addBoolean(true)

    return encoder.serialize()
}

export function encodeArrayU8():ArrayBuffer {
    const data:u8[] = [1, 43, 66, 234, 111]

    const encoder = new CBOREncoder()
    encoder.addArrayU8(data)

    return encoder.serialize()
}

export function encodeBytes():ArrayBuffer {
    const data: Uint8Array = new Uint8Array(2)
    data.set([1,2])

    const encoder = new CBOREncoder()
    encoder.addBytes(data)

    return encoder.serialize()
}

export function encodeObject():ArrayBuffer {
    const encoder = new CBOREncoder()
    encoder.addObject(2)
    encoder.addKey("key1")
    encoder.addUint8(1)
    encoder.addKey("key2")
    encoder.addUint8(100)

    return encoder.serialize()
}

export function encodeArray():ArrayBuffer {
    const encoder = new CBOREncoder()
    encoder.addArray(4)
    encoder.addString("key1")
    encoder.addUint8(1)
    encoder.addString("key2")
    encoder.addUint8(100)

    return encoder.serialize()
}

export function encodeAllInObj():ArrayBuffer {
    const data :u8[] = [1, 43, 66, 234, 111]

    const dataBuf: Uint8Array = new Uint8Array(2)
    dataBuf.set([1,2])

    const encoder = new CBOREncoder()
    encoder.addObject(16)
    encoder.addKey("uint8")
    encoder.addUint8(132)
    encoder.addKey("uint16")
    encoder.addUint16(6554)
    encoder.addKey("uint32")
    encoder.addUint32(6554000)
    encoder.addKey("uint64")
    encoder.addUint64(444842111226)
    encoder.addKey("int8")
    encoder.addInt8(-127)
    encoder.addKey("int16")
    encoder.addInt16(-31500)
    encoder.addKey("int32")
    encoder.addInt32(-6554000)
    encoder.addKey("int64")
    encoder.addInt64(-444842111226)
    encoder.addKey("arrayU8")
    encoder.addArrayU8(data)
    encoder.addKey("true-value")
    encoder.addBoolean(true)
    encoder.addKey("false-value")
    encoder.addBoolean(false)
    encoder.addKey("null-value")
    encoder.addNull()
    encoder.addKey("undefined-value")
    encoder.addUndefined()
    encoder.addKey("f64")
    encoder.addF64(166665455.55)
    encoder.addKey("f32")
    encoder.addF32(78752.323123)
    encoder.addString("bytes")
    encoder.addBytes(dataBuf)

    return encoder.serialize()
}


export function encodeAllInArray():ArrayBuffer {
    const data :u8[] = [1, 43, 66, 234, 111]

    const encoder = new CBOREncoder()
    encoder.addArray(33)
    encoder.addString("uint8")
    encoder.addUint8(132)
    encoder.addString("uint16")
    encoder.addUint16(6554)
    encoder.addString("uint32")
    encoder.addUint32(6554000)
    encoder.addString("uint64")
    encoder.addUint64(444842111226)
    encoder.addString("int8")
    encoder.addInt8(-127)
    encoder.addString("int16")
    encoder.addInt16(-31500)
    encoder.addString("int32")
    encoder.addInt32(-6554000)
    encoder.addString("int64")
    encoder.addInt64(-444842111226)
    encoder.addString("true-value")
    encoder.addBoolean(true)
    encoder.addString("false-value")
    encoder.addBoolean(false)
    encoder.addString("null-value")
    encoder.addNull()
    encoder.addString("undefined-value")
    encoder.addUndefined()
    encoder.addString("f64")
    encoder.addF64(166665455.55)
    encoder.addString("f32")
    encoder.addF32(78752.323123)
    encoder.addString("arrayU8")
    encoder.addArrayU8(data)
    encoder.addObject(1)
    encoder.addKey("int16")
    encoder.addInt16(-31500)
    encoder.addString("bytes")
    const dataBuf: Uint8Array = new Uint8Array(2)
    dataBuf.set([1,2])
    encoder.addBytes(dataBuf)

    return encoder.serialize()
}


export function encodeNestedObjs():ArrayBuffer {

    const encoder = new CBOREncoder()
    encoder.addObject(1)
    encoder.addKey("lvl1")
    encoder.addObject(1)
    encoder.addKey("lvl2")
    encoder.addObject(1)
    encoder.addKey("lvl3")
    encoder.addObject(1)
    encoder.addKey("lvl4")
    encoder.addObject(1)
    encoder.addKey("lvl5")
    encoder.addUint8(132)

    return encoder.serialize()
}

export function encodeMaps_empty():ArrayBuffer {
    const map = new Map<string, string>()

    const encoder = new CBOREncoder()
    encoder.addObject(1)
    encoder.addKey("map")
    encoder.addObject(map.keys().length)
    for( let a = 0; a < map.keys().length; a++ ){
        encoder.addKey(map.keys()[a].toString())
        encoder.addString(map.get(map.keys()[a]))
    }

    return encoder.serialize()
}

export function encodeMaps_full():ArrayBuffer {
    const map = new Map<string, string>()
    map.set("key1", "value1")
    map.set("key2", "value1")
    map.set("key3", "value1")
    map.set("key4", "value1")
    map.set("key5", "value1")
    map.set("key6", "value1")

    const encoder = new CBOREncoder()
    encoder.addObject(1)
    encoder.addKey("map")
    const keys = map.keys()
    encoder.addObject(keys.length)
    for( let a = 0; a < keys.length; a++ ){
        encoder.addKey(keys[a].toString())
        encoder.addString(map.get(keys[a]))
    }

    return encoder.serialize()
}

export function encodeMisc(): ArrayBuffer {
    const map = new Map<string, string>()
    map.set("key1", "data")

    const encoder = new CBOREncoder();
    encoder.addObject(4)
    encoder.addKey("count")
    encoder.addUint64(0)
    encoder.addKey("msg")
    encoder.addString("")
    encoder.addKey("decimal")
    encoder.addF64(0.0)
    encoder.addKey("map")
    let keys_a = map.keys()
    encoder.addObject(keys_a.length)
    for(let a = 0; a < keys_a.length; a++){
        encoder.addKey(keys_a[a].toString())
        encoder.addString(map.get(keys_a[a]))
    }

    return encoder.serialize()
}


export function encodeFloats():ArrayBuffer {

    const encoder = new CBOREncoder()
    encoder.addObject(2)
    encoder.addKey("f32")
    encoder.addF32(1.111)
    encoder.addKey("f64")
    encoder.addF64(1.111)

    return encoder.serialize()
}
