module laya {
    export class MusicManager {
        static _shareMusicManager:MusicManager = null;
        private _musicMap:laya.Map<Laya.SoundChannel>;
        //音量范围 0-1 （0.静音 1.最大）
        private _soundVolume:number;                    
        private _musicVolue:number;
        private _currMusic:string;
        private _currSound:string;

        constructor() {
            this._musicMap = new laya.Map<Laya.SoundChannel>();
            this._soundVolume = 0;
            this._musicVolue = 0;
            this._currMusic = "";
            this._currSound = "";
        }


        public static getInstace() : MusicManager {
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
        }

        public static destoryInstance() : void {
            if(this._shareMusicManager) {
                delete this._shareMusicManager;
                this._shareMusicManager = null;
            }
        }

        private init() : boolean {
            Laya.SoundManager.autoStopMusic = false;
            return true;
        }

        public playMusic(file:string, isLoop:boolean = true, callback?:Laya.Handler) : void {
            if (BANMUSIC) return;
        
            let isFound = this._musicMap.has(file);
            if (isFound) {
                let preChannel = this._musicMap.get(file);
                Laya.SoundManager.removeChannel(preChannel);
                this._musicMap.remove(file);
            }

            let loop = isLoop ? 0 : 1;
            let channel = this._musicMap.at(file); 
            if (!channel) {
                channel = Laya.SoundManager.playMusic(file, loop, callback);
                this._musicMap.add(file, channel);
            }
            else {
                Laya.SoundManager.addChannel(channel);
            }
            
            this._currMusic = file;
        }

        public play(file:string, isLoop:boolean = false, callback?:Laya.Handler) : void {
            if (BANMUSIC) return;

            let isFound = this._musicMap.has(file);
            if (isFound) {
                let preChannel = this._musicMap.get(file);
                Laya.SoundManager.removeChannel(preChannel);
                this._musicMap.remove(file);
            }

            let loop = isLoop ? 0 : 1;
            let channel = Laya.SoundManager.playSound(file, loop, callback);
            this._musicMap.add(file, channel);
            
            this._currSound = file;
        }

        public stopAll() : void {
            Laya.SoundManager.stopAll();
        }

        public stopMusic() : void {
            Laya.SoundManager.stopMusic();
        }

        public stopSound(file:string) : void {
            let channel = this._musicMap.at(file);
            if(channel) {
                this._musicMap.remove(file);
            }
            Laya.SoundManager.stopSound(file);
        }

        public getCurrSound() : string {
            return this._currSound;
        }

        public getCurrMusic() : string {
            return this._currMusic;
        }

        public setSoundVolume(volume:number) : void {
            this._soundVolume = volume;
            Laya.SoundManager.setSoundVolume(volume);
        }

        public getSoundVolume() : number {
            return this._soundVolume;
        }

        public setMusicVolume(volume:number) : void  {
            this._musicVolue = volume;
            Laya.SoundManager.setMusicVolume(volume);
        }

        public isAutoStopMusic() : boolean {
            return Laya.SoundManager.autoStopMusic;
        }

        public isMuted() : boolean {
            return Laya.SoundManager.muted;
        }

        public getChannelByPath(file:string): Laya.SoundChannel {
            let channel = this._musicMap[file];
            if (channel) return channel; else return null; 
        }

        public stopSoundChannel(sound:Laya.SoundChannel) {
            if (!sound) return; 
            for (var key in this._musicMap) {
                let channel = this._musicMap[key];
                if(channel && channel == sound) {
                    Laya.SoundManager.removeChannel(sound);
                }
            }
        }

    }
}