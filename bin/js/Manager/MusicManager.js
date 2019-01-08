var laya;
(function (laya) {
    var MusicManager = /** @class */ (function () {
        function MusicManager() {
            this._musicMap = new laya.Map();
            this._soundVolume = 0;
            this._musicVolue = 0;
            this._currMusic = "";
            this._currSound = "";
        }
        MusicManager.getInstace = function () {
            if (!this._shareMusicManager) {
                this._shareMusicManager = new MusicManager();
                if (this._shareMusicManager.init()) {
                    if (!this._shareMusicManager) {
                        delete this._shareMusicManager;
                        this._shareMusicManager = null;
                    }
                }
            }
            return this._shareMusicManager;
        };
        MusicManager.destoryInstance = function () {
            if (this._shareMusicManager) {
                delete this._shareMusicManager;
                this._shareMusicManager = null;
            }
        };
        MusicManager.prototype.init = function () {
            Laya.SoundManager.autoStopMusic = false;
            return true;
        };
        MusicManager.prototype.playMusic = function (file, isLoop, callback) {
            if (isLoop === void 0) { isLoop = true; }
            if (BANMUSIC)
                return;
            var isFound = this._musicMap.has(file);
            if (isFound) {
                var preChannel = this._musicMap.get(file);
                Laya.SoundManager.removeChannel(preChannel);
                this._musicMap.remove(file);
            }
            var loop = isLoop ? 0 : 1;
            var channel = this._musicMap.at(file);
            if (!channel) {
                channel = Laya.SoundManager.playMusic(file, loop, callback);
                this._musicMap.add(file, channel);
            }
            else {
                Laya.SoundManager.addChannel(channel);
            }
            this._currMusic = file;
        };
        MusicManager.prototype.play = function (file, isLoop, callback) {
            if (isLoop === void 0) { isLoop = false; }
            if (BANMUSIC)
                return;
            var isFound = this._musicMap.has(file);
            if (isFound) {
                var preChannel = this._musicMap.get(file);
                Laya.SoundManager.removeChannel(preChannel);
                this._musicMap.remove(file);
            }
            var loop = isLoop ? 0 : 1;
            var channel = Laya.SoundManager.playSound(file, loop, callback);
            this._musicMap.add(file, channel);
            this._currSound = file;
        };
        MusicManager.prototype.stopAll = function () {
            Laya.SoundManager.stopAll();
        };
        MusicManager.prototype.stopMusic = function () {
            Laya.SoundManager.stopMusic();
        };
        MusicManager.prototype.stopSound = function (file) {
            var channel = this._musicMap.at(file);
            if (channel) {
                this._musicMap.remove(file);
            }
            Laya.SoundManager.stopSound(file);
        };
        MusicManager.prototype.getCurrSound = function () {
            return this._currSound;
        };
        MusicManager.prototype.getCurrMusic = function () {
            return this._currMusic;
        };
        MusicManager.prototype.setSoundVolume = function (volume) {
            this._soundVolume = volume;
            Laya.SoundManager.setSoundVolume(volume);
        };
        MusicManager.prototype.getSoundVolume = function () {
            return this._soundVolume;
        };
        MusicManager.prototype.setMusicVolume = function (volume) {
            this._musicVolue = volume;
            Laya.SoundManager.setMusicVolume(volume);
        };
        MusicManager.prototype.isAutoStopMusic = function () {
            return Laya.SoundManager.autoStopMusic;
        };
        MusicManager.prototype.isMuted = function () {
            return Laya.SoundManager.muted;
        };
        MusicManager.prototype.getChannelByPath = function (file) {
            var channel = this._musicMap[file];
            if (channel)
                return channel;
            else
                return null;
        };
        MusicManager.prototype.stopSoundChannel = function (sound) {
            if (!sound)
                return;
            for (var key in this._musicMap) {
                var channel = this._musicMap[key];
                if (channel && channel == sound) {
                    Laya.SoundManager.removeChannel(sound);
                }
            }
        };
        MusicManager._shareMusicManager = null;
        return MusicManager;
    }());
    laya.MusicManager = MusicManager;
})(laya || (laya = {}));
//# sourceMappingURL=MusicManager.js.map