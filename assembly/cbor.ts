
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
        const ret = new ArrayBuffer(this.offset);
        const retView = new DataView(ret);
        for (let i = u32(0); i < this.offset; ++i)
            retView.setUint8(i, this.dataView.getUint8(i));

        return ret;
    }

    encodeBoolean(value:boolean):void {
        if(!value) return this.writeUint8(0xf4);
        this.writeUint8(0xf5);
    }

    encodeNull(value:null):void {
        this.writeUint8(0xf6);
    }

    encodeUndefined(value:undefined):void {
        this.writeUint8(0xf7);
    }

    encodeString(value:string):void {
        var utf8data: Array<i32> = [];
        for (let i = 0; i < value.length; ++i) {
            var charCode = value.charCodeAt(i);
            if (charCode < 0x80) {
                utf8data.push(charCode);
            } else if (charCode < 0x800) {
                utf8data.push(0xc0 | charCode >> 6);
                utf8data.push(0x80 | charCode & 0x3f);
            } else if (charCode < 0xd800) {
                utf8data.push(0xe0 | charCode >> 12);
                utf8data.push(0x80 | (charCode >> 6)  & 0x3f);
                utf8data.push(0x80 | charCode & 0x3f);
            } else {
                charCode = (charCode & 0x3ff) << 10;
                charCode |= value.charCodeAt(++i) & 0x3ff;
                charCode += 0x10000;

                utf8data.push(0xf0 | charCode >> 18);
                utf8data.push(0x80 | (charCode >> 12)  & 0x3f);
                utf8data.push(0x80 | (charCode >> 6)  & 0x3f);
                utf8data.push(0x80 | charCode & 0x3f);
            }
        }

        this.writeTypeAndLength(3, utf8data.length);
        this.writeUint8Array(utf8data);
    }

    writeUint8(value:u8):void {
        this.prepareWrite(1).setUint8(this.offset, value)
        this.commitWrite();
    }

    writeUint16(value:u16):void {
        this.prepareWrite(2).setUint16(this.offset, value)
        this.commitWrite();
    }

    writeUint32(value:u32):void {
        this.prepareWrite(4).setUint32(this.offset, value)
        this.commitWrite();
    }

    writeUint64(value:u64):void {
        var low = value % POW_2_32;
        var high = (value - low) / POW_2_32;
        var dataView = this.prepareWrite(8);
        dataView.setUint32(this.offset, high);
        dataView.setUint32(this.offset + 4, low);
        this.commitWrite();
    }

    writeUint8Array(value:Array<i32>):void {
        const dataView = this.prepareWrite(value.length);
        for (var i = 0; i < value.length; ++i)
            dataView.setUint8(this.offset + i, value[i]);
        this.commitWrite();
    }

    private commitWrite():void {
        this.offset += this.lastLength;
    }

    private prepareWrite(length:u32):DataView {
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
        return this.dataView;
    }


    private writeTypeAndLength(type:u8, length:u64):void {
        if (length < 24) {
            this.writeUint8(type << 5 | length);
        } else if (length < 0x100) {
            this.writeUint8(type << 5 | 24);
            this.writeUint8(length);
        } else if (length < 0x10000) {
            this.writeUint8(type << 5 | 25);
            this.writeUint16(length);
        } else if (length < 0x100000000) {
            this.writeUint8(type << 5 | 26);
            this.writeUint32(length);
        } else {
            this.writeUint8(type << 5 | 27);
            this.writeUint64(length);
        }
    }

}
