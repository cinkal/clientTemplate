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
    var ResourceManager = /** @class */ (function (_super) {
        __extends(ResourceManager, _super);
        function ResourceManager() {
            var _this = _super.call(this) || this;
            _this._nowcount = 0; //已加载数量
            _this._maxCount = 0; //需加载数量
            _this._currResIndex = VIEWID.VIEWID_NORMAL;
            _this._commonResArray = [];
            _this._loadCommonCount = 0;
            _this._loadNextArray = null;
            return _this;
        }
        ResourceManager.getInstance = function () {
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
        };
        ResourceManager.destoryInstance = function () {
            if (this._shareInstance) {
                this._shareInstance.destory();
                delete this._shareInstance;
                this._shareInstance = null;
            }
        };
        ResourceManager.prototype.destory = function () {
            var len = this._loadedResMap.size();
            if (len > 0) {
                for (var i = 0; i < len; ++i) {
                    this._loadedResMap.removeByIndex(i);
                }
                delete this._loadedResMap;
                this._loadedResMap = null;
            }
        };
        ResourceManager.prototype.loadCommonRes = function () {
            this.loadResWithArray(laya.CommonConfig.configCache, true);
        };
        ResourceManager.prototype.init = function () {
            this._loadedResMap = new laya.Vector();
            this._buildingsTempletMap = new laya.Map();
            this._fontsMap = new laya.Map();
            this._eventDispatcher = laya.Director.getInstance().getEventDispatcher();
            this.loadCommonRes();
            return true;
        };
        ResourceManager.prototype.getBuildingsTempletMap = function () {
            return this._buildingsTempletMap;
        };
        ResourceManager.prototype.loadSceneRes = function (scene) {
            var resArray = null;
            switch (scene) {
                case ScenesType.LoadingScene:
                case ScenesType.LoginScene:
                    {
                        resArray = laya.LoginConfig.configCache;
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
                        resArray = laya.BattleSceneConfig.configCache;
                        this._currResIndex = ScenesType.BattleScene;
                        break;
                    }
            }
            if (!resArray || resArray.length <= 0)
                return;
            this.loadResWithArray(resArray);
        };
        ResourceManager.prototype.loadResWithArray = function (array, isLoadCommon) {
            if (!isLoadCommon && this._loadCommonCount > 0) {
                this._loadNextArray = array;
                return;
            }
            this._nowcount = 0;
            this._maxCount = array.length;
            this._loadCommonCount = isLoadCommon ? array.length : 0;
            for (var i = 0; i < array.length; ++i) {
                var file = array[i];
                switch (file.type) {
                    case Laya.Loader.SK:
                        {
                            var templet = null;
                            templet = this._buildingsTempletMap.at(file.url);
                            if (templet) {
                                if (!isLoadCommon) {
                                    this.loadViewResCallback(null, file.type);
                                }
                                else {
                                    this.loadCommonCallBack();
                                }
                                continue;
                            }
                            templet = new Laya.Templet();
                            var callback = null;
                            if (!isLoadCommon) {
                                callback = this.loadViewResCallback;
                            }
                            else {
                                callback = this.loadCommonCallBack;
                            }
                            templet.on(Laya.Event.COMPLETE, this, callback, [file.url, file.type, templet]);
                            templet.on(Laya.Event.ERROR, this, this.loadResErrorCallBack, [file.url]);
                            templet.loadAni(file.url);
                        }
                        break;
                    case Laya.Loader.FONT:
                        {
                            var bitmapFont = null;
                            bitmapFont = this._fontsMap.at(file.url);
                            if (bitmapFont) {
                                if (!isLoadCommon) {
                                    this.loadViewResCallback(null, file.type);
                                }
                                else {
                                    this.loadCommonCallBack();
                                }
                                continue;
                            }
                            var callback = null;
                            if (!isLoadCommon) {
                                callback = this.loadViewResCallback;
                            }
                            else {
                                callback = this.loadCommonCallBack;
                            }
                            bitmapFont = new Laya.BitmapFont();
                            bitmapFont.loadFont(file.url, Laya.Handler.create(this, callback, [file.url, file.type, bitmapFont]));
                        }
                        break;
                    case Laya.Loader.IMAGE:
                    default:
                        {
                            if (!_super.prototype.getRes.call(this, file.url)) {
                                var callback = null;
                                if (!isLoadCommon) {
                                    callback = this.loadViewResCallback;
                                }
                                else {
                                    callback = this.loadCommonCallBack;
                                }
                                _super.prototype.load.call(this, file.url, Laya.Handler.create(this, callback, [file.url, file.type]), null, file.type);
                            }
                            else {
                                if (!isLoadCommon) {
                                    this.loadViewResCallback(file.url, file.type, null);
                                }
                                else {
                                    this.loadCommonCallBack();
                                }
                            }
                        }
                        break;
                }
            }
        };
        ResourceManager.prototype.loadRes = function (path) {
            _super.prototype.load.call(this, path, Laya.Handler.create(this, this.loadResCallback));
            return true;
        };
        ResourceManager.prototype.loadResCallback = function (path) {
            var p = this._loadedResMap.indexOf(path.url);
            if (p < 0) {
                this._loadedResMap.push(path);
            }
        };
        ResourceManager.prototype.loadCommonCallBack = function () {
            this._loadCommonCount--;
            if (this._loadCommonCount <= 0) {
                this._loadCommonCount = 0;
                if (this._loadNextArray) {
                    this.loadResWithArray(this._loadNextArray, false);
                    this._loadNextArray = null;
                }
            }
        };
        ResourceManager.prototype.loadViewResCallback = function (url, type, data) {
            this._nowcount++;
            switch (type) {
                case Laya.Loader.SK:
                    {
                        if (data)
                            this._buildingsTempletMap.add(data._skBufferUrl, data);
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
        };
        ResourceManager.prototype.loadResErrorCallBack = function (url) {
            this._nowcount++;
            if (this._nowcount >= this._maxCount) {
                this._nowcount = this._maxCount;
                this._eventDispatcher.event(EVENT_RESOURCE_PROGRESS_LOAD_END, { sceneType: this._currResIndex, count: this._nowcount, max: this._maxCount });
            }
        };
        ResourceManager.prototype.getNowProgress = function () {
            return this._nowcount * 100 / this._maxCount;
        };
        //获取缓存资源
        ResourceManager.prototype.getRes = function (url) {
            return _super.prototype.getRes.call(this, url);
        };
        ResourceManager.prototype.clearFile = function (url) {
            _super.prototype.clearTextureRes.call(this, url);
        };
        ResourceManager._shareInstance = null;
        return ResourceManager;
    }(Laya.LoaderManager));
    laya.ResourceManager = ResourceManager;
})(laya || (laya = {}));
//# sourceMappingURL=ResourceManage.js.map