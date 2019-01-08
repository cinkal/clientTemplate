var laya;
(function (laya) {
    var Director = /** @class */ (function () {
        function Director() {
            this._invalid = true;
            this._deltaTimePassedByCaller = false;
            this._actionManager = null;
            this._deltaTime = 0;
            this._scheduler = null;
            this._eventDispatcher = null;
            this._actionManager = null;
            this._nextScene = null;
            this._sendCleanupToScene = false;
            this._purgeDirectorInNextLoop = false;
            this._restartDirectorInNextLoop = false;
            this._oldAnimationInterval = 0.0;
            this._animationInterval = 0.0;
            this._itfGameMgr = null;
        }
        Director.prototype.destory = function () {
            if (this._runningScene) {
                delete this._runningScene;
                this._runningScene = null;
            }
            if (this._actionManager) {
                delete this._actionManager;
                this._actionManager = null;
            }
            if (this._eventDispatcher) {
                delete this._eventDispatcher;
                this._eventDispatcher = null;
            }
            if (this._scheduler) {
                delete this._scheduler;
                this._scheduler = null;
            }
            if (this._sceneStack) {
                this._sceneStack.clear();
                delete this._sceneStack;
            }
        };
        Director.getInstance = function () {
            if (!this._sharedInstance) {
                this._sharedInstance = new Director();
                if (!this._sharedInstance)
                    throw new Error("FATAL: Not enough memory. \n");
                this._sharedInstance.init();
            }
            return this._sharedInstance;
        };
        Director.prototype.init = function () {
            this.setDefaultValues();
            this._runningScene = null;
            this._nextScene = null;
            this._sceneStack = new laya.Vector();
            this._pasused = false;
            this._invalid = false;
            this._actionManager = new laya.ActionManager();
            this._eventDispatcher = new Laya.EventDispatcher();
            this._purgeDirectorInNextLoop = false;
            this._restartDirectorInNextLoop = false;
            this._scheduler = new laya.Scheduler();
            var gameManager = laya.GameManager.getInstace();
            this.setInterfaceGameMgr(gameManager);
            this._reconnectManger = laya.FReconnect.create();
            this._reconnectManger.zOrder = 10;
            Laya.stage.addChild(this._reconnectManger);
            laya.ResourceManager.getInstance();
            this.scheduleMainLoop();
            return true;
        };
        Director.prototype.setInterfaceGameMgr = function (mgr) {
            this._itfGameMgr = mgr;
        };
        Director.prototype.setDefaultValues = function () {
            Laya.init(540, 960, Laya.WebGL);
            Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
            Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
            Laya.stage.scaleMode = "fixedwidth";
            if (initConfig.developMode == SDKConfig.MODE.DEVELOP)
                Laya.Stat.show(0, 0);
        };
        Director.prototype.scheduleMainLoop = function () {
            Laya.timer.frameLoop(1, this, this.mainLoop);
        };
        Director.prototype.unScheduleMainLoop = function () {
            Laya.timer.clear(this, this.mainLoop);
        };
        Director.prototype.reset = function () {
            if (this._runningScene) {
                this._runningScene.onExit();
                this._runningScene.cleanup();
            }
            this._runningScene = null;
            this._nextScene = null;
            //todo: _eventDispatcher->dispatchEvent(_eventResetDirector);
            if (this._eventDispatcher)
                this._eventDispatcher.offAll();
            this._sceneStack.clear();
            this.stopAnimation();
        };
        Director.prototype.drawScene = function () {
            if (!this._pasused) { }
            if (this._itfGameMgr)
                this._itfGameMgr.netDequeue(this._deltaTime);
            if (this._nextScene)
                this.setNextScene();
            if (this._runningScene)
                this._runningScene.update(this._deltaTime);
            if (this._actionManager)
                this._actionManager.update(this._deltaTime);
        };
        Director.prototype.mainLoop = function () {
            this._deltaTimePassedByCaller = true;
            this.calculateDeltaTime();
            if (this._purgeDirectorInNextLoop) {
                this._purgeDirectorInNextLoop = false;
                this.purgeDirector();
            }
            else if (this._restartDirectorInNextLoop) {
                this._restartDirectorInNextLoop = false;
                this.restartDirector();
            }
            else if (!this._invalid) {
                this.drawScene();
            }
        };
        Director.prototype.calculateDeltaTime = function () {
            this._deltaTime = Laya.timer.delta / 1000;
        };
        Director.prototype.setNextScene = function () {
            //todo: _eventDispatcher->dispatchEvent(_beforeSetNextScene);
            var runningIsTransition = (this._runningScene instanceof laya.TransitionScene) ? true : false;
            var newIsTransition = (this._nextScene instanceof laya.TransitionScene) ? true : false;
            if (!newIsTransition) {
                if (this._runningScene) {
                    this._runningScene.onExitTransitionDidStart();
                    this._runningScene.onExit();
                }
                if (this._sendCleanupToScene && this._runningScene) {
                    this._runningScene.cleanup();
                }
            }
            if (this._runningScene) {
                this._runningScene.cleanup();
                this._runningScene = null;
            }
            this._runningScene = this._nextScene;
            this._nextScene = null;
            //    if((!runningIsTransition)  && this._runningScene) 
            if (this._runningScene) {
                Laya.stage.addChild(this._runningScene);
                this._runningScene.onEnter();
                this._runningScene.onEnterTransitionDidFinish();
            }
            //    if (this._runningScene.getSceneType() != ScenesType.LoginScene) this.showReplaceView(REPLACE_VIEW_STATUS.OUT);
            //todo: _eventDispatcher->dispatchEvent(_afterSetNextScene);
        };
        Director.prototype.purgeDirector = function () {
            this.reset();
        };
        Director.prototype.restartDirector = function () {
            this.reset();
            this.startAnimation();
        };
        Director.prototype.pause = function () {
            if (this._pasused)
                return;
            this._pasused = true;
        };
        Director.prototype.resume = function () {
            if (!this._pasused)
                return;
        };
        Director.prototype.restart = function () {
            this._restartDirectorInNextLoop = true;
        };
        Director.prototype.startAnimation = function () {
            this.startAnimationWithParam(SetIntervalReason.BY_ENGINE);
        };
        Director.prototype.startAnimationWithParam = function (reason) {
        };
        Director.prototype.stopAnimation = function () {
            //    this._invalid = true;
        };
        Director.prototype.setAnimationInterval = function (interval, reason) {
            this._animationInterval = interval;
            if (!this._invalid) {
                this.stopAnimation();
                this.startAnimationWithParam(reason);
            }
            if (interval >= 0.0160000 && interval < 0.0333333) {
                Laya.stage.frameRate = Laya.Stage.FRAME_FAST;
            }
            else if (interval >= 0.0333333 && interval < 0.04) {
                Laya.stage.frameRate = Laya.Stage.FRAME_SLOW;
            }
            else {
                Laya.stage.frameRate = Laya.Stage.FRAME_MOUSE;
            }
        };
        Director.prototype.getAnimationInterval = function () {
            return this._animationInterval;
        };
        Director.prototype.getEventDispatcher = function () {
            return this._eventDispatcher;
        };
        Director.prototype.setEventDispatcher = function (dispatcher) {
            this._eventDispatcher = dispatcher;
        };
        Director.prototype.runWithScene = function (scene) {
            if (!scene)
                throw new Error("This command can only be used to start the Director. There is already a scene present. \n");
            if (this._runningScene)
                throw Error("_runningScene should be null. \n");
            this.pushScene(scene);
            this.startAnimation();
        };
        Director.prototype.pushScene = function (scene) {
            if (!scene)
                throw new Error("the scene should not null. \n");
            this._sendCleanupToScene = false;
            this._sceneStack.push(scene);
            this._nextScene = scene;
        };
        Director.prototype.popScene = function () {
            if (!this._runningScene)
                throw new Error("running scene should not null");
            this._sceneStack.pop();
            var size = this._sceneStack.size();
            if (size == 0) {
                this.end();
            }
            else {
                this._sendCleanupToScene = true;
                this._nextScene = this._sceneStack.at(size - 1);
            }
        };
        Director.prototype.popToSceneStackLevel = function (level) {
            if (!this._runningScene)
                throw Error("A running Scene is needed. \n");
            var size = this._sceneStack.size();
            if (level == 0) {
                this.end();
                return;
            }
            if (level >= size)
                return;
            var firstOnStackScene = this._sceneStack.back();
            if (firstOnStackScene == this._runningScene) {
                this._sceneStack.pop();
                --size;
            }
            while (size > level) {
                var current = this._sceneStack.back();
                if (current.isRunning()) {
                    current.onExit();
                }
                current.cleanup();
                this._sceneStack.pop();
                --size;
            }
            this._nextScene = this._sceneStack.back();
            this._sendCleanupToScene = true;
        };
        Director.prototype.replaceScene = function (scene, showReplace) {
            if (showReplace === void 0) { showReplace = true; }
            if (!scene)
                throw new Error("the scene should not be null. \n");
            if (!this._runningScene) {
                this.runWithScene(scene);
                return;
            }
            if (scene == this._nextScene)
                return;
            if (this._nextScene) {
                if (this._nextScene.isRunning()) {
                    this._nextScene.onExit();
                }
                this._nextScene.cleanup();
                this._nextScene = null;
            }
            var index = this._sceneStack.size() - 1;
            this._sendCleanupToScene = true;
            var item = this._sceneStack.replace(index, scene);
            if (item)
                item.cleanup();
            this._nextScene = scene;
            //    Laya.stage.addChild(scene);
        };
        Director.prototype.popToRootScene = function () {
            this.popToSceneStackLevel(1);
        };
        Director.prototype.getRunningScene = function () {
            return this._runningScene;
        };
        Director.prototype.setActionManager = function (manager) {
            this._actionManager = manager;
        };
        Director.prototype.getActionManager = function () {
            return this._actionManager;
        };
        Director.prototype.end = function () {
            this._purgeDirectorInNextLoop = true;
        };
        Director.prototype.setAnimationIntervalExtar = function (interval) {
            this.setAnimationInterval(interval, SetIntervalReason.BY_GAME);
        };
        Director.prototype.getFReconnect = function () {
            return this._reconnectManger;
        };
        Director._sharedInstance = null;
        return Director;
    }());
    laya.Director = Director;
})(laya || (laya = {}));
//# sourceMappingURL=Director.js.map