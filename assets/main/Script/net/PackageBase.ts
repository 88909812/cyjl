import { SocketServer } from "./SocketServer";

export class PackageBase {
    msgProto: any; 
    cmdID:string;


    constructor(cmdID: string) {
        this.cmdID = cmdID;
        return this;
    }

    /** 添加 data*/
    d(data) {
        this.msgProto = data;
        return this;
    }

    to(server: SocketServer, listenerCb?:any, errorCb?: any): void {
        if (server == null) {
            return;
        }
        server.send(this.buff(server), listenerCb, errorCb);

        //console.log("send: " + this.cmdID);
    }

    buff(server) {
        let packLen = 2;
        let keyLen = 1;
        let cmdLen = 3;
        let protoBuff = this.msgProto.toBuffer();
        var protoArr = new Uint8Array(protoBuff);
        let pack = new Uint8Array(packLen + keyLen + cmdLen + protoArr.length);

        let packLenArr = new Uint8Array(packLen);
        let packLenHexStr = ('0'.repeat(packLen * 2) + Number(protoArr.length + 4).toString(16)).slice(-packLen * 2);
        for (let _i2 = 0; _i2 < packLenArr.length; _i2++) {
            packLenArr[_i2] = parseInt(packLenHexStr.substring(_i2 * 2, _i2 * 2 + 2), 16);
        }

        let keyLenArr = new Uint8Array(keyLen);
        keyLenArr[0] = 0;

        let cmdLenArr = new Uint8Array(cmdLen);
        let cmdLenHexStr = this.cmdID.slice(-cmdLen * 2);
        for (let _i2 = 0; _i2 < cmdLenArr.length; _i2++) {
            cmdLenArr[_i2] = parseInt(cmdLenHexStr.substring(_i2 * 2, _i2 * 2 + 2), 16);
        }

        pack.set(packLenArr);
        pack.set(keyLenArr, packLen);
        pack.set(cmdLenArr, packLen + keyLen);
        pack.set(new Uint8Array(protoArr), packLen + keyLen + cmdLen);
        server.Encode(pack);
        return pack.buffer;
    }


}
