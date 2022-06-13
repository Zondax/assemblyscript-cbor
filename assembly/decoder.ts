/********************************************************************************
 The MIT License (MIT)

 Copyright (c) 2014 Patrick Gansterer <paroga@paroga.com>
 Copyright (c) 2022 Zondax AG

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 *********************************************************************************/

// Latest commit used --> https://github.com/paroga/cbor-js/commit/65dc49611107db83aff8308a6b381f4d7933824b

import {Arr, Handler, JSONHandler, Value} from "./types";

const POW_2_24 = 5.960464477539063e-8
const POW_2_32 = 4294967296
const POW_2_53 = 9007199254740992;

export class CBORDecoder{
    private data: ArrayBuffer
    private dataView: DataView
    private offset: u32
    private lastKey: string
    private handler: Handler

    constructor(serializedData: ArrayBuffer) {
        this.data = serializedData
        this.dataView = new DataView(this.data);
        this.offset = 0;
        this.lastKey = "";
        this.handler = new Handler()
    }

    private commitRead(length: u32):void {
        this.offset += length;
    }

    private readArrayBuffer(length:u32): Uint8Array {
        const value = Uint8Array.wrap(this.data, this.offset, length)
        this.commitRead(length);
        return value
    }

    private readFloat16():f32 {
        const tempArrayBuffer = new ArrayBuffer(4);
        const tempDataView = new DataView(tempArrayBuffer);
        const value = this.readUint16();

        const sign = value & 0x8000;
        let exponent = value & 0x7c00;
        const fraction = value & 0x03ff;

        if (exponent === 0x7c00)
            exponent = 0xff << 10;
        else if (exponent !== 0)
            exponent += (127 - 15) << 10;
        else if (fraction !== 0)
            return f32((sign ? -1 : 1) * fraction * POW_2_24)

        tempDataView.setUint32(0, sign << 16 | exponent << 13 | fraction << 13);
        return tempDataView.getFloat32(0);
    }

    private readFloat32():f32 {
        const value = this.dataView.getFloat32(this.offset)
        this.commitRead(4 );
        return value
    }
    private readFloat64():f64 {
        const value = this.dataView.getFloat64(this.offset)
        this.commitRead(8 );
        return value
    }

    private readUint8():u8 {
        const value = this.dataView.getUint8(this.offset)
        this.commitRead(1 );
        return value
    }

    private readUint16():u16 {
        const value = this.dataView.getUint16(this.offset)
        this.commitRead(2 );
        return value
    }

    private readUint32():u32 {
        const value = this.dataView.getUint32(this.offset)
        this.commitRead(4 );
        return value
    }

    private readUint64():u64 {
        const hi = this.readUint32()
        const lo = this.readUint32()
        return  hi * POW_2_32 + lo;
    }

    private readBreak():boolean {
        if (this.dataView.getUint8(this.offset) !== 0xff)
            return false;
        this.offset += 1;
        return true;
    }

    private readLength(additionalInformation:u64):i64 {
        if (additionalInformation < 24)
            return i64(additionalInformation);
        if (additionalInformation === 24)
            return i64(this.readUint8());
        if (additionalInformation === 25)
            return i64(this.readUint16());
        if (additionalInformation === 26)
            return i64(this.readUint32());
        if (additionalInformation === 27)
            return i64(this.readUint64());
        if (additionalInformation === 31)
            return -1;
        throw "Invalid length encoding";
    }

    private readIndefiniteStringLength(majorType:u64):i64 {
        const initialByte = this.readUint8();
        if (initialByte === 0xff)
            return -1;
        var length = this.readLength(initialByte & 0x1f);
        if (length < 0 || (initialByte >> 5) !== majorType)
            throw "Invalid indefinite length element";
        return length;
    }

    private appendUtf16Data(utf16data: Array<i32>, length:i64):void {
        for (let i = 0; i < length; ++i) {
            let value = i32(this.readUint8());
            if (value & 0x80) {
                if (value < 0xe0) {
                    value = (value & 0x1f) <<  6
                        | (this.readUint8() & 0x3f);
                    length -= 1;
                } else if (value < 0xf0) {
                    value = (value & 0x0f) << 12
                        | (this.readUint8() & 0x3f) << 6
                        | (this.readUint8() & 0x3f);
                    length -= 2;
                } else {
                    value = (value & 0x0f) << 18
                        | (this.readUint8() & 0x3f) << 12
                        | (this.readUint8() & 0x3f) << 6
                        | (this.readUint8() & 0x3f);
                    length -= 3;
                }
            }

            if (value < 0x10000) {
                utf16data.push(value);
            } else {
                value -= 0x10000;
                utf16data.push(0xd800 | (value >> 10));
                utf16data.push(0xdc00 | (value & 0x3ff));
            }
        }
    }

    private deserialize():void {
        const initialByte = this.readUint8();
        const majorType = initialByte >> 5;
        const additionalInformation = initialByte & 0x1f;
        //let i;
        let length: i64;

        if (majorType === 7) {
            switch (additionalInformation) {
                case 25:
                    this.handler.setFloat(this.lastKey, this.readFloat16())
                    this.lastKey = ""
                    return
                case 26:
                    this.handler.setFloat(this.lastKey, this.readFloat32())
                    this.lastKey = ""
                    return
                case 27:
                    this.handler.setFloat(this.lastKey, this.readFloat64())
                    this.lastKey = ""
                    return
            }
        }

        length = this.readLength(additionalInformation);
        if (length < 0 && (majorType < 2 || u8(6) < majorType))
            throw "Invalid length";

        switch (majorType) {
            case 0:
                this.handler.setInteger(this.lastKey, length);
                this.lastKey = ""
                return
            case 1:
                this.handler.setInteger(this.lastKey, -1 - length);
                this.lastKey = ""
                return
            case 2:
                // FIXME need support to Uint8Array on types, as this is a unstructured byte array
                /*if (length < 0) {
                    const elements = new Array<Uint8Array>();
                    let fullArrayLength = 0;
                    while ((length = this.readIndefiniteStringLength(majorType)) >= 0) {
                        fullArrayLength += length;
                        elements.push(this.readArrayBuffer(length));
                    }
                    const fullArray = new Uint8Array(fullArrayLength);
                    let fullArrayOffset = 0;
                    for (i = 0; i < elements.length; ++i) {
                        fullArray.set(elements[i], fullArrayOffset);
                        fullArrayOffset += elements[i].length;
                    }
                    this.handler.pushArray("")
                    this.readArrayBuffer(length);
                    return fullArray.toString("hex");
                }
                this.handler.pushArray("")
                this.readArrayBuffer(length);*/
            case 3:
                // https://github.com/AssemblyScript/assemblyscript/issues/1609
                const utf16data: i32[] = [];
                if (length < 0) {
                    while ((length = this.readIndefiniteStringLength(majorType)) >= 0)
                        this.appendUtf16Data(utf16data, length);
                } else{
                    this.appendUtf16Data(utf16data, length);
                }
                if(this.handler.stack.length > 0){
                    if (this.handler.peek.isObj) {
                        if (this.lastKey == "") {
                            this.lastKey = String.fromCharCodes(utf16data)
                        } else {
                            this.handler.setString(this.lastKey, String.fromCharCodes(utf16data))
                            this.lastKey = ""
                        }
                    }
                    if(this.handler.peek.isArr){
                        this.handler.setString(this.lastKey, String.fromCharCodes(utf16data))
                        this.lastKey = ""
                    }
                }
                else
                    this.handler.setString("", String.fromCharCodes(utf16data))

                return
            case 4:
                this.handler.pushArray(this.lastKey)
                this.lastKey = ""

                if (length < 0) {
                    while (!this.readBreak())
                        this.deserialize()
                } else {
                    for (let i = 0; i < length; ++i)
                        this.deserialize()
                }
                this.handler.popArray()
                return
            case 5:
                this.handler.pushObject(this.lastKey)
                this.lastKey = ""
                for (let i = 0; i < length || length < 0 && !this.readBreak(); ++i) {
                    // Deserialize key
                    this.deserialize()
                    // Deserialize value
                    this.deserialize()
                }
                this.handler.popObject()
                return
            case 6:
                //return tagger(decodeItem(), length);
                throw `tags not implemented`
            case 7:
                switch (u32(length)) {
                    case 20:
                        this.handler.setBoolean(this.lastKey, false);
                        this.lastKey = ""
                        return
                    case 21:
                        this.handler.setBoolean(this.lastKey, true);
                        this.lastKey = ""
                        return
                    case 22:
                        this.handler.setNull(this.lastKey);
                        this.lastKey = ""
                        return
                    case 23:
                        this.handler.setUndefined(this.lastKey);
                        this.lastKey = ""
                        return
                    default:
                        throw `simple values not implemented`
                }
        }
    }

    parse(): Value{
        this.deserialize()
        return this.handler.peek
    }
}
