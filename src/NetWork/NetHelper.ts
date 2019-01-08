module laya {
   export module NetHelper {
        export function SVR_SET_CMD(command : number, data:any) : NetPacket {
            let packet = new NetPacket();
            packet._cmd = command;
            packet._errorCode = 0;
            packet._data = data;

            return packet;
        }

        export function GET_PKT_SIZE(protoBuffer:any) : number {
            return protoBuffer.ByteSize() + PKT_HEAD_LEN;
        }

        export function SENDMSG(packet:NetPacket) : number {
           return GameManager.getInstace().getServerDispatcher().sendMsg(packet);
        }

        export function C2S_SEND(cmd:number, data:any) : number {
            let ser = GameManager.getInstace().getServerDispatcher();
            let pack = ser.getSendPack(cmd, data);
            if(pack){
                return ser.sendMsg(pack);
            }
            return 0;
        }
    }
    
}