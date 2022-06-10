
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

    addString(value:string):void {
        const utf8data: Array<u8> = [];
        for (let i = 0; i < value.length; ++i) {
            let charCode = value.charCodeAt(i);
            if (charCode < 0x80) {
                utf8data.push(u8(charCode));
            } else if (charCode < 0x800) {
                utf8data.push(u8(0xc0 | charCode >> 6));
                utf8data.push(u8(0x80 | charCode & 0x3f));
            } else if (charCode < 0xd800) {
                utf8data.push(u8(0xe0 | charCode >> 12));
                utf8data.push(u8(0x80 | (charCode >> 6)  & 0x3f));
                utf8data.push(u8(0x80 | charCode & 0x3f));
            } else {
                charCode = (charCode & 0x3ff) << 10;
                charCode |= value.charCodeAt(++i) & 0x3ff;
                charCode += 0x10000;

                utf8data.push(u8(0xf0 | charCode >> 18));
                utf8data.push(u8(0x80 | (charCode >> 12)  & 0x3f));
                utf8data.push(u8(0x80 | (charCode >> 6)  & 0x3f));
                utf8data.push(u8(0x80 | charCode & 0x3f));
            }
        }

        this.writeTypeAndLength(3, utf8data.length);
        this.writeUint8Array(utf8data);
    }

    addArrayU8(value:Array<u8>):void{
        this.writeTypeAndLength(4, value.length);
        for (let i = 0; i < value.length; ++i)
            this.writeTypeAndLength(0, u64(value[i]));
    }

    addUint8(value:u8):void {
        this.writeUint8(value)
    }

    addUint16(value:u16):void {
        this.writeUint16(value)
    }

    addUint32(value:u32):void {
        this.writeUint32(value)
    }

    addUint64(value:u64):void {
        this.writeUint64(value)
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

    private writeUint8Array(value:Array<u8>):void {
        this.prepareWrite(value.length);
        for (let i = 0; i < value.length; ++i)
            this.dataView.setUint8(this.offset + i, value[i]);
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

}
