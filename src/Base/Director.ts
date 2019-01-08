module laya {
    export class Director {
       private static _sharedInstance:Director = null;
       /* whether or not the director is in a valid state */
       protected _invalid:boolean;
       /** ActionManager associated with this director */
       protected _actionManager:ActionManager;
       /** EventDispatcher associated with this director */
       protected _eventDispatcher:Laya.EventDispatcher;
       /* The running scene */
       protected _runningScene:Scene;
       /* will be the next 'runningScene' in the next frame nextScene is a weak reference. */
       protected _nextScene:Scene;
       /** Whether or not the Director is paused */
       protected _pasused;
       /* delta time since last tick to main loop */
       protected _deltaTime:number;
       protected _deltaTimePassedByCaller:boolean;
       /* If true, then "old" scene will receive the cleanup message */
       protected _sendCleanupToScene:boolean;
       /* scheduled scenes */
       protected _sceneStack:Vector<Scene>;
       // this flag will be set to true in end()
       protected _purgeDirectorInNextLoop:boolean;
       // this flag will be set to true in restart()
       protected _restartDirectorInNextLoop:boolean;
       protected _animationInterval:number;
       protected _oldAnimationInterval:number;
       protected _scheduler:Scheduler;
       private _baseScene:Laya.View;
       private _itfGameMgr:InterfaceGameMgr;
       protected _reconnectManger:FReconnect;

       constructor() {
         this._invalid = true;
         this._deltaTimePassedByCaller = false;
         this._actionManager = null;
         this._deltaTime  = 0;
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

       public destory() : void {
           if(this._runningScene) { delete this._runningScene; this._runningScene = null; }
           if(this._actionManager) { delete this._actionManager; this._actionManager = null; }
           if(this._eventDispatcher) { delete this._eventDispatcher; this._eventDispatcher = null; }
           if(this._scheduler) { delete this._scheduler; this._scheduler = null; }
           if(this._sceneStack) { this._sceneStack.clear(); delete this._sceneStack; }

       } 

       public static getInstance() : Director {
           if(!this._sharedInstance) {
                this._sharedInstance = new Director();
                if(!this._sharedInstance) throw new Error("FATAL: Not enough memory. \n");
                this._sharedInstance.init();
           }

           return this._sharedInstance;
       }


       private init():boolean {

           this.setDefaultValues();
           this._runningScene = null;
           this._nextScene = null;
           this._sceneStack = new Vector<Scene>();
           this._pasused = false;
           this._invalid = false;
           this._actionManager = new ActionManager();
           this._eventDispatcher = new Laya.EventDispatcher();
           this._purgeDirectorInNextLoop = false;
           this._restartDirectorInNextLoop = false;
           this._scheduler = new Scheduler();

           let gameManager =  GameManager.getInstace();
           this.setInterfaceGameMgr(gameManager);
           
           this._reconnectManger = FReconnect.create();
           this._reconnectManger.zOrder = 10;
           Laya.stage.addChild(this._reconnectManger);

           ResourceManager.getInstance();
           this.scheduleMainLoop();
           return true;
       }


       public setInterfaceGameMgr(mgr:InterfaceGameMgr) : void {
           this._itfGameMgr = mgr;
       }

       public setDefaultValues() : void {
           Laya.init(540, 960, Laya.WebGL);
           Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
           Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
           Laya.stage.scaleMode = "fixedwidth";
           if (initConfig.developMode == SDKConfig.MODE.DEVELOP) Laya.Stat.show(0,0);
       }
       
       public scheduleMainLoop() : void {
           Laya.timer.frameLoop(1, this, this.mainLoop);
        }

       public unScheduleMainLoop() : void {
            Laya.timer.clear(this, this.mainLoop);
        }
       
       protected reset() : void {
           if(this._runningScene) {
               this._runningScene.onExit();
               this._runningScene.cleanup();
           }

           this._runningScene = null;
           this._nextScene = null;

           //todo: _eventDispatcher->dispatchEvent(_eventResetDirector);

           if(this._eventDispatcher) this._eventDispatcher.offAll();

           this._sceneStack.clear();

           this.stopAnimation();

       }

       public drawScene() : void {
         if(!this._pasused) {}
         
         if(this._itfGameMgr) this._itfGameMgr.netDequeue(this._deltaTime);

         if(this._nextScene) this.setNextScene();

         if(this._runningScene) this._runningScene.update(this._deltaTime);

         if(this._actionManager) this._actionManager.update(this._deltaTime);
       }

       public mainLoop() : void {
           this._deltaTimePassedByCaller = true;
           this.calculateDeltaTime();

           if(this._purgeDirectorInNextLoop) {
               this._purgeDirectorInNextLoop = false;
                this.purgeDirector();
           }
           else if(this._restartDirectorInNextLoop) {
               this._restartDirectorInNextLoop = false;
               this.restartDirector();
           }
           else if(!this._invalid) {
               this.drawScene();
           }
         
       }

       private calculateDeltaTime() : void {
         this._deltaTime = Laya.timer.delta / 1000;
       }


       protected setNextScene() : void {

           //todo: _eventDispatcher->dispatchEvent(_beforeSetNextScene);

           let runningIsTransition = (this._runningScene instanceof TransitionScene) ? true : false;
           let newIsTransition = (this._nextScene instanceof TransitionScene) ? true : false;
           
           if(!newIsTransition) 
           {
               if(this._runningScene) {
                    this._runningScene.onExitTransitionDidStart();
                    this._runningScene.onExit();
               }    
              

                if(this._sendCleanupToScene && this._runningScene) {
                    this._runningScene.cleanup();
                }
           }

           if(this._runningScene) {
               this._runningScene.cleanup();
               this._runningScene = null;
           }

           this._runningScene = this._nextScene;
           this._nextScene = null;
        //    if((!runningIsTransition)  && this._runningScene) 
           if(this._runningScene)
           {
               Laya.stage.addChild(this._runningScene);
               this._runningScene.onEnter();
               this._runningScene.onEnterTransitionDidFinish();
           }

        //    if (this._runningScene.getSceneType() != ScenesType.LoginScene) this.showReplaceView(REPLACE_VIEW_STATUS.OUT);
           //todo: _eventDispatcher->dispatchEvent(_afterSetNextScene);
       }

       protected purgeDirector() : void {
           this.reset();

       }

       protected restartDirector() : void {
           this.reset();

           this.startAnimation();
       }

       public pause() : void {
           if(this._pasused) return;

           this._pasused = true;
       }

       public resume() : void {
           if(!this._pasused) return;
       }


       public restart() : void {
           this._restartDirectorInNextLoop = true;
       }

       public startAnimation() : void {
           this.startAnimationWithParam(SetIntervalReason.BY_ENGINE);
       }

       public startAnimationWithParam(reason:SetIntervalReason) : void {

       }

       public stopAnimation() : void {
        //    this._invalid = true;
       }
       

       protected setAnimationInterval(interval:number, reason:SetIntervalReason) : void {
           this._animationInterval = interval;
           if(!this._invalid) {
               this.stopAnimation();
               this.startAnimationWithParam(reason);
           }
           if(interval >= 0.0160000 && interval < 0.0333333) {
                Laya.stage.frameRate = Laya.Stage.FRAME_FAST;
           }
           else if(interval >= 0.0333333 && interval < 0.04) {
               Laya.stage.frameRate = Laya.Stage.FRAME_SLOW;
           }
           else {
               Laya.stage.frameRate = Laya.Stage.FRAME_MOUSE;
           }
       } 

       public getAnimationInterval() : number {
           return this._animationInterval;
       }

       public getEventDispatcher() : Laya.EventDispatcher {
           return this._eventDispatcher;
       }

       public setEventDispatcher(dispatcher:Laya.EventDispatcher) : void {
           this._eventDispatcher = dispatcher;
       }

       public runWithScene(scene:Scene) : void {
            if(!scene) throw new Error("This command can only be used to start the Director. There is already a scene present. \n");
            if(this._runningScene) throw Error("_runningScene should be null. \n");

            this.pushScene(scene);
            this.startAnimation();
       }

       public pushScene(scene:Scene) : void {
           if(!scene) throw new Error("the scene should not null. \n");
           this._sendCleanupToScene = false;

           this._sceneStack.push(scene);
           this._nextScene = scene;
       }

       public popScene() : void {
           if(!this._runningScene) throw new Error("running scene should not null");

           this._sceneStack.pop();
           let size = this._sceneStack.size();
           if(size == 0) {
               this.end();
           }
           else {
               this._sendCleanupToScene = true;
               this._nextScene = this._sceneStack.at(size - 1);
           }

       }

       public popToSceneStackLevel(level:number) : void {
           if(!this._runningScene) throw Error("A running Scene is needed. \n");
           let size = this._sceneStack.size();

           if(level == 0) {
               this.end();
               return;
           }

           if(level >= size) return;

           let firstOnStackScene = this._sceneStack.back();
           if(firstOnStackScene == this._runningScene) {
               this._sceneStack.pop();
               --size;
           }

           while(size > level) {
               let current = this._sceneStack.back();
               if(current.isRunning()) {
                   current.onExit();
               }

               current.cleanup();

               this._sceneStack.pop();
               --size;
           }

           this._nextScene = this._sceneStack.back();
           this._sendCleanupToScene = true;
       }

       public replaceScene(scene:Scene, showReplace:boolean = true) : void {
           if(!scene) throw new Error("the scene should not be null. \n");

           if(!this._runningScene) { this.runWithScene(scene); return; }

           if(scene == this._nextScene) return;

           if(this._nextScene) {
               if(this._nextScene.isRunning()) {
                   this._nextScene.onExit();
               }
               this._nextScene.cleanup();
               this._nextScene = null;
           }

           let index = this._sceneStack.size() - 1;
           this._sendCleanupToScene  = true;

           let item = this._sceneStack.replace(index, scene);
           if(item) item.cleanup();

           this._nextScene = scene;
        //    Laya.stage.addChild(scene);
       }

       public popToRootScene() : void {
           this.popToSceneStackLevel(1);
       }

       public getRunningScene() : Scene {
           return this._runningScene;
       }

       public setActionManager(manager:ActionManager) : void {
           this._actionManager = manager;
       }

       public getActionManager() : ActionManager {
           return this._actionManager;
       }

       private end() : void {
           this._purgeDirectorInNextLoop = true;
       }

       public setAnimationIntervalExtar(interval:number) : void {
           this.setAnimationInterval(interval, SetIntervalReason.BY_GAME);
       }

       public getFReconnect() : FReconnect {
           return this._reconnectManger;
       }

    }
}