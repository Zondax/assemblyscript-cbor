import {CBORDecoder} from "./decoder";
import {Float, Integer, Null, Str, Value} from "./types";

function stringToArrayBuffer(val: string): ArrayBuffer {
    const buff = new ArrayBuffer(val.length / 2)
    const view = new DataView(buff)
    for( let i = 0, j = 0; i < val.length; i = i + 2, j++){
        view.setUint8(j, u8(Number.parseInt(`${val.at(i)}${val.at(i+1)}`, 16)))
    }
    return buff
}

export function decodeNull():boolean {
    const buff = stringToArrayBuffer("f6")

    const decoder = new CBORDecoder(buff)
    decoder.deserialize()

    const res = <Value>decoder.handler.peek
    return res.isNull
}

export function decodeInteger(): i64 {
    const buff = stringToArrayBuffer("01")

    const decoder = new CBORDecoder(buff)
    decoder.deserialize()

    const res = <Value>decoder.handler.peek
    if(res.isInteger){
        const num = (<Integer>res).valueOf();
        return num
    }
    return 0
}

export function decodeFloat32(): f64 {
    const buff = stringToArrayBuffer("fb40fe0f31c0000000")

    const decoder = new CBORDecoder(buff)
    decoder.deserialize()

    const res = <Value>decoder.handler.peek
    if(res.isFloat){
        const num = (<Float>res).valueOf();
        return num
    }
    return 0
}

export function decodeFloat64(): f64 {
    const buff = stringToArrayBuffer("fb4204eb792310e38e")

    const decoder = new CBORDecoder(buff)
    decoder.deserialize()

    const res = <Value>decoder.handler.peek
    if(res.isFloat){
        const num = (<Float>res).valueOf();
        return num
    }
    return 0
}

export function decodeString(): string {
    const buff = stringToArrayBuffer("6a746573742076616c7565")

    const decoder = new CBORDecoder(buff)
    decoder.deserialize()

    const res = <Value>decoder.handler.peek
    if(res.isString){
        const str = (<Str>res).valueOf();
        return str
    }

    return ""
}
