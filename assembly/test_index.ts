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
