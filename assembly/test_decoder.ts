import {CBORDecoder} from "./decoder";
import {Arr, Bool, Float, Integer, Null, Obj, Str, Undefined, Value} from "./types";

function stringToArrayBuffer(val: string): ArrayBuffer {
    const buff = new ArrayBuffer(val.length / 2)
    const view = new DataView(buff)
    for( let i = 0, j = 0; i < val.length; i = i + 2, j++){
        view.setUint8(j, u8(Number.parseInt(`${val.at(i)}${val.at(i+1)}`, 16)))
    }
    return buff
}


export function decodeFalse():bool {
    const buff = stringToArrayBuffer("f4")

    const decoder = new CBORDecoder(buff)
    const res = decoder.parse()

    const num = (<Bool>res).valueOf();
    return num

}

export function decodeTrue():bool {
    const buff = stringToArrayBuffer("f5")

    const decoder = new CBORDecoder(buff)
    const res = decoder.parse()

    const num = (<Bool>res).valueOf();
    return num
}

export function decodeNull():boolean {
    const buff = stringToArrayBuffer("f6")

    const decoder = new CBORDecoder(buff)
    const res = decoder.parse()

    return res.isNull
}

export function decodeInteger(): i64 {
    const buff = stringToArrayBuffer("01")

    const decoder = new CBORDecoder(buff)
    const res = decoder.parse()

    const num = (<Integer>res).valueOf();
    return num
}

export function decodeFloat32(): f64 {
    const buff = stringToArrayBuffer("fb40fe0f31c0000000")

    const decoder = new CBORDecoder(buff)
    const res = decoder.parse()

    const num = (<Float>res).valueOf();
    return num
}

export function decodeFloat64(): f64 {
    const buff = stringToArrayBuffer("fb4204eb792310e38e")

    const decoder = new CBORDecoder(buff)
    const res = decoder.parse()

    const num = (<Float>res).valueOf();
    return num
}

export function decodeString(): string {
    const buff = stringToArrayBuffer("6a746573742076616c7565")

    const decoder = new CBORDecoder(buff)
    const res = decoder.parse()

    const str = (<Str>res).valueOf();
    return str
}

export function decodeObject(): boolean {
    const buff = stringToArrayBuffer("a2646b65793101646b6579321864")

    const decoder = new CBORDecoder(buff)
    const res = decoder.parse()

    const obj = (<Obj>res).valueOf();
    const val1 = (<Integer>obj.get("key1")).valueOf()
    const val2 = (<Integer>obj.get("key2")).valueOf()

    return val1 == 1 && val2 == 100
}

export function decodeArrayU8(): boolean {
    const fixArray: u8[] = [1, 43, 66, 234, 111]
    const buff = stringToArrayBuffer("8501182b184218ea186f")

    const decoder = new CBORDecoder(buff)
    const res = decoder.parse()
    const arr = (<Arr>res).valueOf();

    let result = arr.length == fixArray.length
    for( let i = 0; i < fixArray.length; i++){
        result = result && (<Integer>arr.at(i)).valueOf() == fixArray[i];
    }

    return result
}

export function decodeAll(): boolean{
    const fixArray: u8[] = [1, 43, 66, 234, 111]
    const buff = stringToArrayBuffer("af6575696e743818846675696e74313619199a6675696e7433321a006401906675696e7436341b0000006792a7f0fa64696e7438387e65696e743136397b0b65696e7433323a0064018f65696e7436343b0000006792a7f0f967617272617955388501182b184218ea186f6a747275652d76616c7565f56b66616c73652d76616c7565f46a6e756c6c2d76616c7565f66f756e646566696e65642d76616c7565f763663634fb41a3de39df19999a63663332fb40f33a0520000000")

    const decoder = new CBORDecoder(buff)

    const res = decoder.parse()
    const obj = (<Obj>res).valueOf();

    const uint8 = (<Integer>obj.get("uint8")).valueOf()
    const uint16 = (<Integer>obj.get("uint16")).valueOf()
    const uint32 = (<Integer>obj.get("uint32")).valueOf()
    const uint64 = (<Integer>obj.get("uint64")).valueOf()
    const int8 = (<Integer>obj.get("int8")).valueOf()
    const int16 = (<Integer>obj.get("int16")).valueOf()
    const int32 = (<Integer>obj.get("int32")).valueOf()
    const int64 = (<Integer>obj.get("int64")).valueOf()
    const trueVal = (<Bool>obj.get("true-value")).valueOf()
    const falseVal = (<Bool>obj.get("false-value")).valueOf()
    const nullVal = (<Null>obj.get("null-value")).valueOf()
    const undefinedVal = (<Undefined>obj.get("undefined-value")).valueOf()
    const f64 = (<Float>obj.get("f64")).valueOf()
    const f32 = (<Float>obj.get("f32")).valueOf()
    const arrayU8 = (<Arr>obj.get("arrayU8")).valueOf()

    let arrayResult = arrayU8.length == fixArray.length
    for( let i = 0; i < fixArray.length; i++){
        arrayResult = arrayResult && (<Integer>arrayU8.at(i)).valueOf() == fixArray[i];
    }

    return      uint8 == 132 && uint16 == 6554 && uint32 == 6554000 && uint64 == 444842111226
            &&  int8 == -127 && int16 == -31500 && int32 == -6554000 && int64 == -444842111226
            && !!trueVal && !falseVal && !nullVal && !undefinedVal
            && f64 == 166665455.55 && f32 == 78752.3203125
            && arrayResult
}


export function decodeNestedObjs(): bool{
    const buff = stringToArrayBuffer("a1646c766c31a1646c766c32a1646c766c33a1646c766c34a1646c766c351884")
    const decoder = new CBORDecoder(buff)

    const res = decoder.parse()
    const obj = (<Obj>res).valueOf();

    return      obj.has("lvl1")
        && (obj.get("lvl1") as Obj).has("lvl2")
        && ((obj.get("lvl1") as Obj).get("lvl2") as Obj).has("lvl3")
        && (((obj.get("lvl1") as Obj).get("lvl2") as Obj).get("lvl3") as Obj).has("lvl4")
        && ((((obj.get("lvl1") as Obj).get("lvl2") as Obj).get("lvl3") as Obj).get("lvl4") as Obj).has("lvl5")
        && (((((obj.get("lvl1") as Obj).get("lvl2") as Obj).get("lvl3") as Obj).get("lvl4") as Obj).get("lvl5") as Integer).valueOf() == 132
}
