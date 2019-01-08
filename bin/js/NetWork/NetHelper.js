var laya;
(function (laya) {
    var NetHelper;
    (function (NetHelper) {
        function SVR_SET_CMD(command, data) {
            var packet = new laya.NetPacket();
            packet._cmd = command;
            packet._errorCode = 0;
            packet._data = data;
            return packet;
        }
        NetHelper.SVR_SET_CMD = SVR_SET_CMD;
        function GET_PKT_SIZE(protoBuffer) {
            return protoBuffer.ByteSize() + PKT_HEAD_LEN;
        }
        NetHelper.GET_PKT_SIZE = GET_PKT_SIZE;
        function SENDMSG(packet) {
            return laya.GameManager.getInstace().getServerDispatcher().sendMsg(packet);
        }
        NetHelper.SENDMSG = SENDMSG;
        function C2S_SEND(cmd, data) {
            var ser = laya.GameManager.getInstace().getServerDispatcher();
            var pack = ser.getSendPack(cmd, data);
            if (pack) {
                return ser.sendMsg(pack);
            }
            return 0;
        }
        NetHelper.C2S_SEND = C2S_SEND;
    })(NetHelper = laya.NetHelper || (laya.NetHelper = {}));
})(laya || (laya = {}));
//# sourceMappingURL=NetHelper.js.map