module laya {
    export class ResourceManager extends Laya.LoaderManager {
        private static _shareInstance: ResourceManager = null;
        private _PreLoadResArray: any[];
        private _nowcount: number = 0;//已加载数量
        private _maxCount: number = 0;//需加载数量
        private _currResIndex: number
        private _loadedResMap: Vector<string>;
        private _buildingsTempletMap: Map<Laya.Templet>
        private _eventDispatcher: Laya.EventDispatcher;
        private _commonResArray: any[];
        private _fontsMap: Map<Laya.BitmapFont>;
        private _loadCommonCount:number;
        private _loadNextArray:any;

        constructor() {
            super();
            this._currResIndex = VIEWID.VIEWID_NORMAL;
            this._commonResArray = [];
            this._loadCommonCount = 0;
            this._loadNextArray = null;

        }

        public static getInstance(): ResourceManager {
            if (!this._shareInstance) {
                this._shareInstance = new ResourceManager();
                if (this._shareInstance.init()) {
                    if (!this._shareInstance) {
                        this._shareInstance = null;
                        return null;
                    }
                }
            }
            return this._shareInstance;
        }

        public static destoryInstance(): void {
            if (this._shareInstance) {
                this._shareInstance.destory();
                delete this._shareInstance;
                this._shareInstance = null;
            }
        }

        private destory(): void {
            let len = this._loadedResMap.size();
            if (len > 0) {
                for (let i = 0; i < len; ++i) {
                    this._loadedResMap.removeByIndex(i);
                }
                delete this._loadedResMap;
                this._loadedResMap = null;
            }

        }

        private loadCommonRes(): any {
            this.loadResWithArray(CommonConfig.configCache, true);
        }

        public init(): boolean {
            this._loadedResMap = new Vector<string>();
            this._buildingsTempletMap = new Map<Laya.Templet>();
            this._fontsMap = new Map<Laya.BitmapFont>();
            this._eventDispatcher = Director.getInstance().getEventDispatcher();
            this.loadCommonRes();
            return true;
        }

        public getBuildingsTempletMap() {
            return this._buildingsTempletMap;
        }

        public loadSceneRes(scene: ScenesType): number {
            let resArray = null;
            switch (scene) {
                case ScenesType.LoadingScene:
                case ScenesType.LoginScene:
                {
                    resArray = LoginConfig.configCache;
                    this._currResIndex = ScenesType.LoginScene;
                    break;
                }
                case ScenesType.MainScene:
                {
                    this._currResIndex = ScenesType.MainScene;
                    break;
                }
                case ScenesType.BattleScene:
                {
                    resArray = BattleSceneConfig.configCache;
                    this._currResIndex = ScenesType.BattleScene;
                    break;
                }
            }

            if (!resArray || resArray.length <= 0) return;
            this.loadResWithArray(resArray);
        }

        private loadResWithArray(array: any[], isLoadCommon?: boolean): void {
            if (!isLoadCommon && this._loadCommonCount > 0) {this._loadNextArray = array; return;}
            this._nowcount = 0;
            this._maxCount = array.length;
            this._loadCommonCount = isLoadCommon ? array.length : 0;
            for (let i = 0; i < array.length; ++i) {
                let file = array[i];
                switch (file.type) {
                    case Laya.Loader.SK:
                        {
                            let templet = null;
                            templet = this._buildingsTempletMap.at(file.url);
                            if (templet) {
                                if (!isLoadCommon) {
                                    this.loadViewResCallback(null, file.type);
                                }else {
                                    this.loadCommonCallBack();
                                } 
                                continue;
                            }
                            templet = new Laya.Templet();
                            let callback = null;
                            if (!isLoadCommon) {
                                callback = this.loadViewResCallback;
                            }else {
                                callback = this.loadCommonCallBack;
                            } 
                            templet.on(Laya.Event.COMPLETE, this, callback, [file.url, file.type, templet]);
                            templet.on(Laya.Event.ERROR, this, this.loadResErrorCallBack, [file.url]);
                            templet.loadAni(file.url);
                        }
                        break;
                    case Laya.Loader.FONT:
                        {
                            let bitmapFont = null;
                            bitmapFont = this._fontsMap.at(file.url);
                            if (bitmapFont) {
                                if (!isLoadCommon) {
                                    this.loadViewResCallback(null, file.type);
                                }else {
                                    this.loadCommonCallBack();
                                }
                                continue;
                            }

                            let callback = null;
                            if (!isLoadCommon) {
                                callback = this.loadViewResCallback;
                            }else {
                                callback = this.loadCommonCallBack;
                            } 
                            bitmapFont = new Laya.BitmapFont();
                            bitmapFont.loadFont(file.url, Laya.Handler.create(this, callback, [file.url, file.type, bitmapFont]));
                        }
                        break;
                    case Laya.Loader.IMAGE:
                    default:
                        {
                            if (!super.getRes(file.url)) {
                                let callback = null;
                                if (!isLoadCommon) {
                                    callback = this.loadViewResCallback;
                                }else {
                                    callback = this.loadCommonCallBack;
                                }
                                super.load(file.url, Laya.Handler.create(this, callback, [file.url, file.type]), null, file.type);
                            }
                            else {
                                if (!isLoadCommon) {
                                    this.loadViewResCallback(file.url, file.type, null);
                                }else {
                                    this.loadCommonCallBack();
                                }
                            }

                        }
                        break;
                }
            }
        }

        public loadRes(path: string): boolean {
            super.load(path, Laya.Handler.create(this, this.loadResCallback));
            return true;
        }

        private loadResCallback(path: any): void {
            let p = this._loadedResMap.indexOf(path.url);
            if (p < 0) {
                this._loadedResMap.push(path);
            }
        }

        private loadCommonCallBack() : void {
            this._loadCommonCount --;
            if (this._loadCommonCount <= 0) {
                this._loadCommonCount = 0;
                if (this._loadNextArray) {
                    this.loadResWithArray(this._loadNextArray, false);
                    this._loadNextArray = null;
                }
            } 
        }

        public loadViewResCallback(url?: any, type?: any, data?: any): void {
            this._nowcount++;

            switch (type) {
                case Laya.Loader.SK:
                    {
                        if (data) this._buildingsTempletMap.add(data._skBufferUrl, data);
                    }
                    break;
                case Laya.Loader.FONT:
                    {
                        if (data) {
                            this._fontsMap.add(url, data);
                            Laya.Text.registerBitmapFont(url, data);
                        }
                    }
                    break;
                case Laya.Loader.IMAGE:
                default:
                    break;
            }

            if (this._nowcount >= this._maxCount) {
                this._nowcount = this._maxCount;
                this._eventDispatcher.event(EVENT_RESOURCE_PROGRESS_LOAD_END, { sceneType: this._currResIndex, count: this._nowcount, max: this._maxCount });
            }
            else {
                this._eventDispatcher.event(EVENT_LOADING_PROGRESS_VALUE, { sceneType: this._currResIndex, count: this._nowcount, max: this._maxCount });
            }
        }

        public loadResErrorCallBack(url:any) : void {
            this._nowcount++;
            if (this._nowcount >= this._maxCount) {
                this._nowcount = this._maxCount;
                this._eventDispatcher.event(EVENT_RESOURCE_PROGRESS_LOAD_END, { sceneType: this._currResIndex, count: this._nowcount, max: this._maxCount });
            }
        }

        public getNowProgress(): number {
            return this._nowcount * 100 / this._maxCount;
        }

        //获取缓存资源
        public getRes(url: string): any {
            return super.getRes(url);
        }

        public clearFile(url: string): void {
            super.clearTextureRes(url);
        }
    }
}