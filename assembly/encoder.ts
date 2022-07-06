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

const POW_2_24 = 5.960464477539063e-8
const POW_2_32 = 4294967296
const POW_2_53 = 9007199254740992;

export class CBOREncoder {
    private data: ArrayBuffer
    private dataView: DataView
    private offset: u32
    private lastLength: u32

    constructor() {
        this.data = new ArrayBuffer(256);
        this.dataView = new DataView(this.data);
        this.offset = 0
        this.lastLength = 0
    }

    serialize(): ArrayBuffer{
        return this.data.slice(0, this.offset);
    }

    addBoolean(value:boolean):void {
        if(!value) return this.writeUint8(0xf4);
        this.writeUint8(0xf5);
    }

    addNull():void {
        this.writeUint8(0xf6);
    }

    addUndefined():void {
        this.writeUint8(0xf7);
    }

    addObject(len:u32):void{
        this.writeTypeAndLength(5, len);
    }

    addArray(len:u32):void{
        this.writeTypeAndLength(4, len);
    }

    addKey(key:string):void{
        this.addString(key);
    }

    addBytes(value:Uint8Array):void {
        this.writeTypeAndLength(2, value.byteLength);
        this.writeUint8Array(value);
    }

    addString(value:string):void {
        const utf8data = String.UTF8.encode(value);
        const buffer: Uint8Array = Uint8Array.wrap(utf8data);

        this.writeTypeAndLength(3, buffer.length);
        this.writeUint8Array(buffer);
    }

    addUint8(value:u8):void {
        this.writeTypeAndLength(0, u64(value))
    }

    addUint16(value:u16):void {
        this.writeTypeAndLength(0, u64(value))
    }

    addUint32(value:u32):void {
        this.writeTypeAndLength(0, u64(value))
    }

    addUint64(value:u64):void {
        this.writeTypeAndLength(0, u64(value))
    }

    addInt8(value:i8):void {
        if (0 <= value && value <= POW_2_53)
            this.writeTypeAndLengthSigned(0, i64(value));
        if (-POW_2_53 <= value && value < 0)
            this.writeTypeAndLengthSigned(1, i64(-(value + 1)));
    }

    addInt16(value:i16):void {
        if (0 <= value && value <= POW_2_53)
            this.writeTypeAndLengthSigned(0, i64(value));
        if (-POW_2_53 <= value && value < 0)
            this.writeTypeAndLengthSigned(1, i64(-(value + 1)));
    }

    addInt32(value:i32):void {
        if (0 <= value && value <= POW_2_53)
            this.writeTypeAndLengthSigned(0, i64(value));
        if (-POW_2_53 <= value && value < 0)
            this.writeTypeAndLengthSigned(1, i64(-(value + 1)));
    }

    addInt64(value:i64):void {
        if (0 <= value && value <= POW_2_53)
            this.writeTypeAndLengthSigned(0, i64(value));
        if (-POW_2_53 <= value && value < 0)
            this.writeTypeAndLengthSigned(1, i64(-(value + 1)));
    }

    addF32(value:f32):void {
        this.writeUint8(0xfa);
        this.writeFloat32(value)
    }

    addF64(value:f64):void {
        this.writeUint8(0xfb);
        this.writeFloat64(value)
    }

    private writeFloat32(value:f32):void {
        this.prepareWrite(4)
        this.dataView.setFloat32(this.offset, value)
        this.commitWrite();
    }

    private writeFloat64(value:f64):void {
        this.prepareWrite(8)
        this.dataView.setFloat64(this.offset, value)
        this.commitWrite();
    }

    private writeUint8(value:u8):void {
        this.prepareWrite(1)
        this.dataView.setUint8(this.offset, value)
        this.commitWrite();
    }

    private writeUint16(value:u16):void {
        this.prepareWrite(2)
        this.dataView.setUint16(this.offset, value)
        this.commitWrite();
    }

    private writeUint32(value:u32):void {
        this.prepareWrite(4)
        this.dataView.setUint32(this.offset, value)
        this.commitWrite();
    }

    private writeUint64(value:u64):void {
        const low = u32(value % POW_2_32);
        const high = u32((value - low) / POW_2_32);
        this.prepareWrite(8);
        this.dataView.setUint32(this.offset, high);
        this.dataView.setUint32(this.offset + 4, low);
        this.commitWrite();
    }

    private writeUint8Array(value:Uint8Array):void {
        this.prepareWrite(value.byteLength);
        for (let i = 0; i < value.byteLength; ++i) {
            this.dataView.setUint8(this.offset + i, value.at(i));
        }
        this.commitWrite();
    }

    private commitWrite():void {
        this.offset += this.lastLength;
    }

    private prepareWrite(length:u32):void {
        let newByteLength = u32(this.data.byteLength);
        const requiredLength = this.offset + length;
        while (newByteLength < requiredLength)
            newByteLength <<= 1;
        if (newByteLength !== this.data.byteLength) {
            const oldDataView = this.dataView;
            this.data = new ArrayBuffer(newByteLength);
            this.dataView = new DataView(this.data);
            const uint32count = (this.offset + 3) >> 2;
            for (let i = u32(0); i < uint32count; ++i)
                this.dataView.setUint32(i << 2, oldDataView.getUint32(i << 2));
        }

        this.lastLength = length;
    }


    private writeTypeAndLength(type:u8, length:u64):void {
        if (length < 24) {
            this.writeUint8(u8(type << 5 | length));
        } else if (length < 0x100) {
            this.writeUint8(u8(type << 5 | 24));
            this.writeUint8(u8(length));
        } else if (length < 0x10000) {
            this.writeUint8(u8(type << 5 | 25));
            this.writeUint16(u16(length));
        } else if (length < 0x100000000) {
            this.writeUint8(u8(type << 5 | 26));
            this.writeUint32(u32(length));
        } else {
            this.writeUint8(u8(type << 5 | 27));
            this.writeUint64(u64(length));
        }
    }

    private writeTypeAndLengthSigned(type:u8, length:i64):void {
        if (length < 24) {
            this.writeUint8(u8(type << 5 | length));
        } else if (length < 0x100) {
            this.writeUint8(u8(type << 5 | 24));
            this.writeUint8(u8(length));
        } else if (length < 0x10000) {
            this.writeUint8(u8(type << 5 | 25));
            this.writeUint16(u16(length));
        } else if (length < 0x100000000) {
            this.writeUint8(u8(type << 5 | 26));
            this.writeUint32(u32(length));
        } else {
            this.writeUint8(u8(type << 5 | 27));
            this.writeUint64(u64(length));
        }
    }
}
