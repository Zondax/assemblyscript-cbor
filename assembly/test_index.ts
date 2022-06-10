import {CBOREncoder} from "./cbor";


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
    const data = new Array<u8>()
    data.push(1)
    data.push(43)
    data.push(66)
    data.push(234)
    data.push(111)

    const encoder = new CBOREncoder()
    encoder.addArrayU8(data)

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

export function encodeAll():ArrayBuffer {
    const data = new Array<u8>()
    data.push(1)
    data.push(43)
    data.push(66)
    data.push(234)
    data.push(111)

    const encoder = new CBOREncoder()
    encoder.addObject(15)
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

    return encoder.serialize()
}
