module laya {
    const kSceneFade:number = 0xFADEFADE;
    export class TransitionEaseScene {
        constructor() {}

        public cleanup() : void {

        }

        public easeActionWithAction(action:ActionInterval) : ActionInterval {
            return null;
        }
    }

    export class TransitionScene extends Scene {
        protected _duration:number;
        protected _inScene:Scene;
        protected _outScene:Scene;
        protected _isInSceneOnTop:boolean;
        protected _isSendCleanupToScene:boolean;

        constructor() {
            super(); 
            this._inScene = null;
            this._outScene = null;
            this._duration = 0.0;
            this._isInSceneOnTop = false;
            this._isSendCleanupToScene = false;
        }

        public static create(delta?:number, scene?:Scene) : TransitionScene {
            let ret = new TransitionScene();
            if(ret && ret.initWithDuration(delta, scene)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public initWithDuration(delta:number, scene:Scene) : boolean {
            if(!scene) throw new Error("Argument scene must be non-nil. \n");

            if(super.init()) {
                this._duration = delta;
            }

            this._inScene = scene;
            // this._inScene.alpha = 0.0;
            this._outScene = Director.getInstance().getRunningScene();
            if(!this._outScene) {
                this._outScene = Scene.create();
                this._outScene.onEnter();
            }

            if(!this._inScene) throw new Error("Incoming scene must be different from the outgoing scene. \n");

            this.sceneOrder();

            return true;
        }

        public onEnter() : void {
            super.onEnter();
            // this._eventDispatcher
            this._outScene.onExitTransitionDidStart();

            //避免多次加载onEnter
            //this._inScene.onEnter();
        }

        public onExit() : void {
            super.onExit();

            this._outScene.onExit();
            this._inScene.onEnterTransitionDidFinish();
        }

        public update(dt:number) : void {
            // super.draw();
            // if(this._isInSceneOnTop) {
            //     this._outScene.update(dt);
            // }
            // else {
            //     this._outScene.update(dt);
            // }
             this._outScene.update(dt);
        }

        protected sceneOrder() : void
        {
            this._isInSceneOnTop = true;
        }

        public cleanup() : void {
            if(this._isSendCleanupToScene) this._outScene.cleanup();
            super.cleanup();
        }

        public finish() : void {
            Director.getInstance().replaceScene(this._inScene);
            this._inScene.visible = true;
            this._inScene.pos(0, 0);
            this._inScene.rotation = 0.0;
            
            if(!this._outScene || this._outScene._destroyed) return;
            this._outScene.visible = false;
            this._outScene.pos(0, 0);
            this._outScene.rotation = 0.0;
        }

        public hideOutShowIn() : void  {
            this._inScene.visible = true;
            this._outScene.visible = false;
        }
    }

    export class TransitionFade extends TransitionScene {
        private _color:string;
        constructor() {
            super();
            this._color = "#272727";
        }

        public static create(duration?:number, scene?:Scene, color?:string) : TransitionFade
        {
            let ret = new TransitionFade();
            if(ret && ret.initWithDuration(duration, scene, color)) {
                return ret;
            }
            ret = null;
            return null;
        }

        public initWithDuration(duration:number, scene:Scene, color?:string) : boolean {
            if(super.initWithDuration(duration, scene)) {
                if(color) this._color = color;
            }   

            return true;
        }

        public onEnter() : void {
            super.onEnter();

            let layerColor = new Laya.Sprite();
            layerColor.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, this._color);
            layerColor.alpha = 0.75;
            this._inScene.visible = false;
            layerColor.zOrder = 2;
            layerColor.name = kSceneFade.toString();
            this.addChild(layerColor);

            let f = this.getChildByName(kSceneFade.toString());

            let actions = new Vector<FiniteTimeAction>();
            actions.push(FadeIn.create(this._duration / 2));
            actions.push(CallFunc.create(Laya.Handler.create(this, this.hideOutShowIn)));
            actions.push(FadeOut.create(this._duration / 2));
            actions.push(CallFunc.create(Laya.Handler.create(this, this.finish)));
            let seq = Sequence.create(actions);

            f.runAction(seq);
        }

        public onExit() : void {
            super.onExit();
            this.removeChildByName(kSceneFade.toString());
        }
    }
}