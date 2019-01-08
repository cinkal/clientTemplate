var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var laya;
(function (laya) {
    var SEND_MSG_OK = 0;
    var SEND_MSG_ERR = -1;
    var NetDispatcher = /** @class */ (function (_super) {
        __extends(NetDispatcher, _super);
        function NetDispatcher() {
            var _this = _super.call(this) || this;
            _this._cmdMap = [];
            _this._asyncCmdMap = [];
            _this._id = NetDispatcherType.NET_DISPATCHER_NULL;
            _this._state = new laya.NetState();
            _this._state.reset();
            _this._loadMessage = false;
            _this._heartbeatInterval = 5;
            _this._toThreshold = 20;
            _this._ip = null;
            _this._port = 0;
            _this._tcp = null;
            _this._isRebuild = false;
            _this._rebuildCallback = null;
            _this._rebuildCount = 0;
            _this._seed = 0;
            return _this;
        }
        NetDispatcher.prototype.destory = function () {
            if (this._tcp) {
                this._tcp.finish();
                this._tcp.destory();
                delete this._tcp;
                this._tcp = null;
            }
            if (this._cmdMap) {
                for (var i = 0; i < this._cmdMap.length; ++i) {
                    this._cmdMap.splice(i);
                }
                delete this._cmdMap;
                this._cmdMap = null;
            }
            this.unRegsiterEvent();
        };
        NetDispatcher.prototype.init = function () {
            //暂时的协议最大数;
            this._cmdBasePO = 65535;
            this._cmdBasePI = 65535;
            //保存发送和接收cmd 
            this.registerEvent();
            // this._encryptManager = EncryptManager.create("ZUWeD5XNKJSRLyEb", "1234567890123456");
            return true;
        };
        NetDispatcher.prototype.dequeue = function (delta) {
            if (!this._state._isEnable || !this._loadMessage)
                return;
            var idx = 0;
            var seed = 0;
            var netCmd = 0;
            var errorCode = 0;
            var len = 0;
            var event = null;
            var buffer = null;
            this.timeTicking(delta);
            this.keepAlive(delta);
            while (this._tcp && this._tcp.getRecvQueue().getMsgNum() > -1) {
                this._state._timeElapse = 0;
                event = this._tcp.getRecvQueue().getFreeBuff();
                if (!event)
                    continue;
                if (event._cmd == NetEventCmd.CloseSocket) {
                    CONSOLE_LOG("[%s]Connection close by peer! broadcast event...", "Server Dispatcher");
                    laya.Director.getInstance().getEventDispatcher().event(EVENT_NET, laya.NetEventCapturor.create(EVENT_NET, EVENT_NET_CLOSE, this._id));
                    break;
                }
                if (event._cmd != NetEventCmd.ReadEvent)
                    continue;
                var srcBuffer = (event._data);
                srcBuffer.pos = 0;
                idx = srcBuffer.getUint16(); //head
                seed = srcBuffer.getUint16();
                netCmd = srcBuffer.getUint16(); //cmd
                errorCode = srcBuffer.getUint16();
                len = srcBuffer.getUint16();
                buffer = srcBuffer.getUint8Array(srcBuffer.pos, len);
                this.onDispatch(errorCode, netCmd, buffer, len);
                if (this._state._isFreeTcp) {
                    CONSOLE_LOG("[%s]Free TCP!", "Server Dispatcher");
                    this.freeTcp();
                    return;
                }
            }
            if (this.isTimeOut(delta)) {
                this.timeoutHandle();
            }
            if (this._tcp) {
                this._tcp.execute();
            }
        };
        NetDispatcher.prototype.onDispatch = function (errorCode, cmd, data, len) {
            return 0;
        };
        NetDispatcher.prototype.powerOn = function (ip, port, callback) {
            if (!ip)
                return false;
            this._ip = ip;
            this._port = port;
            this._state.reset();
            this._tcp = new laya.TcpClient(ip, port);
            this._tcp.start();
            this._state._isEnable = true;
            this._rebuildCallback = callback ? callback : null;
            return true;
        };
        NetDispatcher.prototype.getRebuildCount = function () {
            return this._rebuildCount;
        };
        NetDispatcher.prototype.resetRebuildCount = function () {
            this._rebuildCount = 0;
        };
        NetDispatcher.prototype.connectionRebuild = function (callback) {
            this._rebuildCount += 1;
            this.freeTcp();
            this._isRebuild = true;
            return this.powerOn(this._ip, this._port, callback);
        };
        NetDispatcher.prototype.sendMsg = function (packet) {
            var ret = 0;
            if (this._tcp == null) {
                if (!this.powerOn(this._ip, this._port))
                    return SEND_MSG_ERR;
            }
            var packetLen = 0;
            if (packet._data)
                packetLen = packet._data.length;
            var len = packetLen + 16;
            var sendBuffer = new Laya.Byte();
            sendBuffer.endian = Laya.Byte.BIG_ENDIAN;
            sendBuffer.writeUint16(packet._head);
            this._seed = this.calcSeed(this._seed);
            sendBuffer.writeUint16(this._seed);
            sendBuffer.writeUint16(packet._cmd);
            sendBuffer.writeUint16(packet._errorCode);
            sendBuffer.writeUint16(packetLen);
            // if (packet._data && packet._data.length > 0) {
            // packet._data = this._encryptManager.encode(packet._data); 
            // sendBuffer.writeUint16(packet._data.length) 
            // } 
            // if(packetLen > 0) sendBuffer.writeArrayBuffer(packet._data.__getBuffer());
            if (packetLen > 0)
                sendBuffer.writeArrayBuffer(packet._data);
            ret = this._tcp.getSendQueue().addMsg(255, NetEventCmd.WriteEvent, sendBuffer, len);
            switch (ret) {
                case QUEUE_RET_CODE.eSendSuccess:
                    this.resetTimeTicking();
                    break;
                case QUEUE_RET_CODE.eQueueFull:
                    CONSOLE_LOG("[%s]Send queue buffer is full, pending.", "Server Dispatcher");
                    break;
                case QUEUE_RET_CODE.eBufferNotEnougth:
                    CONSOLE_LOG("[%s]Send queue buffer is not enough!", "Server Dispatcher");
                    break;
                case QUEUE_RET_CODE.eNetClose:
                    {
                        //todo: 发送事件通知UI 做网络错误处理
                        CONSOLE_LOG("[%s]Socket close!!!", "Server Dispatcher");
                        laya.Director.getInstance().getEventDispatcher().event(EVENT_NET, laya.NetEventCapturor.create(EVENT_NET, EVENT_NET_CLOSE, this._id));
                    }
                    break;
                default:
                    break;
            }
            return ret == QUEUE_RET_CODE.eSendSuccess ? SEND_MSG_OK : SEND_MSG_ERR;
        };
        NetDispatcher.prototype.isTimeOut = function (delta) {
            return this._state._timeElapse > this._toThreshold;
        };
        NetDispatcher.prototype.setEnable = function (enable) {
            this._state._isEnable = enable;
        };
        NetDispatcher.prototype.isEnable = function () {
            return this._state._isEnable;
        };
        NetDispatcher.prototype.getNetState = function () {
            return this._state;
        };
        NetDispatcher.prototype.registerEvent = function () {
            laya.Director.getInstance().getEventDispatcher().on(EVENT_NET, this, this.startNetDispatcher);
        };
        NetDispatcher.prototype.unRegsiterEvent = function () {
            laya.Director.getInstance().getEventDispatcher().off(EVENT_NET, this, this.startNetDispatcher);
        };
        NetDispatcher.prototype.startNetDispatcher = function (e) {
            if (e && e._subEvent == EVENT_NET_START) {
                this._state._isEnable = true;
            }
        };
        NetDispatcher.prototype.keepAlive = function (delta) {
        };
        NetDispatcher.prototype.timeTicking = function (delta) {
            if (this._state._isTracingEnable) {
                this._state._timeElapse += delta;
            }
        };
        NetDispatcher.prototype.resetTimeTicking = function () {
            this._state._timeElapse = 0;
        };
        NetDispatcher.prototype.freeTcp = function () {
            if (!this._tcp)
                return;
            this._state.reset();
            this._tcp.finish();
            this._tcp.destory();
            delete this._tcp;
            this._tcp = null;
        };
        NetDispatcher.prototype.timeoutHandle = function () {
            CONSOLE_LOG("[%s]Broadcast timeout event...", "Server Dispatcher");
            if (!this._state._waitRebuild) {
                this._state._waitRebuild = true;
                laya.Director.getInstance().getEventDispatcher().event(EVENT_NET, laya.NetEventCapturor.create(EVENT_NET, EVENT_NET_REBUILD, this._id));
            }
        };
        NetDispatcher.prototype.getResCmd = function (reqCmd) {
            var has = reqCmd in this._cmdMap;
            if (has) {
                return this._cmdMap[reqCmd];
            }
            return 0x7f;
        };
        NetDispatcher.prototype.setLoadMessage = function (loadMessage) {
            this._loadMessage = loadMessage;
        };
        NetDispatcher.prototype.getLoadMessage = function () {
            return this._loadMessage;
        };
        NetDispatcher.prototype.setRebuild = function (isRebuil) {
            this._isRebuild = isRebuil;
        };
        NetDispatcher.prototype.isRebuild = function () {
            return this._isRebuild;
        };
        NetDispatcher.prototype.calcSeed = function (seed) {
            seed ^= (seed >> 11);
            seed ^= (seed << 7) & 11230001077;
            seed ^= (seed << 15) & 47821313;
            return (seed ^ (seed >> 18)) % 32768;
        };
        NetDispatcher.prototype.getSeed = function () {
            return this._seed;
        };
        NetDispatcher.prototype.setSeed = function (seed) {
            this._seed = seed;
        };
        return NetDispatcher;
    }(Laya.EventDispatcher));
    laya.NetDispatcher = NetDispatcher;
})(laya || (laya = {}));
//# sourceMappingURL=NetDispatcher.js.map