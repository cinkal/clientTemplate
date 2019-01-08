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
    var kSceneFade = 0xFADEFADE;
    var TransitionEaseScene = /** @class */ (function () {
        function TransitionEaseScene() {
        }
        TransitionEaseScene.prototype.cleanup = function () {
        };
        TransitionEaseScene.prototype.easeActionWithAction = function (action) {
            return null;
        };
        return TransitionEaseScene;
    }());
    laya.TransitionEaseScene = TransitionEaseScene;
    var TransitionScene = /** @class */ (function (_super) {
        __extends(TransitionScene, _super);
        function TransitionScene() {
            var _this = _super.call(this) || this;
            _this._inScene = null;
            _this._outScene = null;
            _this._duration = 0.0;
            _this._isInSceneOnTop = false;
            _this._isSendCleanupToScene = false;
            return _this;
        }
        TransitionScene.create = function (delta, scene) {
            var ret = new TransitionScene();
            if (ret && ret.initWithDuration(delta, scene)) {
                return ret;
            }
            ret = null;
            return null;
        };
        TransitionScene.prototype.initWithDuration = function (delta, scene) {
            if (!scene)
                throw new Error("Argument scene must be non-nil. \n");
            if (_super.prototype.init.call(this)) {
                this._duration = delta;
            }
            this._inScene = scene;
            // this._inScene.alpha = 0.0;
            this._outScene = laya.Director.getInstance().getRunningScene();
            if (!this._outScene) {
                this._outScene = laya.Scene.create();
                this._outScene.onEnter();
            }
            if (!this._inScene)
                throw new Error("Incoming scene must be different from the outgoing scene. \n");
            this.sceneOrder();
            return true;
        };
        TransitionScene.prototype.onEnter = function () {
            _super.prototype.onEnter.call(this);
            // this._eventDispatcher
            this._outScene.onExitTransitionDidStart();
            //避免多次加载onEnter
            //this._inScene.onEnter();
        };
        TransitionScene.prototype.onExit = function () {
            _super.prototype.onExit.call(this);
            this._outScene.onExit();
            this._inScene.onEnterTransitionDidFinish();
        };
        TransitionScene.prototype.update = function (dt) {
            // super.draw();
            // if(this._isInSceneOnTop) {
            //     this._outScene.update(dt);
            // }
            // else {
            //     this._outScene.update(dt);
            // }
            this._outScene.update(dt);
        };
        TransitionScene.prototype.sceneOrder = function () {
            this._isInSceneOnTop = true;
        };
        TransitionScene.prototype.cleanup = function () {
            if (this._isSendCleanupToScene)
                this._outScene.cleanup();
            _super.prototype.cleanup.call(this);
        };
        TransitionScene.prototype.finish = function () {
            laya.Director.getInstance().replaceScene(this._inScene);
            this._inScene.visible = true;
            this._inScene.pos(0, 0);
            this._inScene.rotation = 0.0;
            if (!this._outScene || this._outScene._destroyed)
                return;
            this._outScene.visible = false;
            this._outScene.pos(0, 0);
            this._outScene.rotation = 0.0;
        };
        TransitionScene.prototype.hideOutShowIn = function () {
            this._inScene.visible = true;
            this._outScene.visible = false;
        };
        return TransitionScene;
    }(laya.Scene));
    laya.TransitionScene = TransitionScene;
    var TransitionFade = /** @class */ (function (_super) {
        __extends(TransitionFade, _super);
        function TransitionFade() {
            var _this = _super.call(this) || this;
            _this._color = "#272727";
            return _this;
        }
        TransitionFade.create = function (duration, scene, color) {
            var ret = new TransitionFade();
            if (ret && ret.initWithDuration(duration, scene, color)) {
                return ret;
            }
            ret = null;
            return null;
        };
        TransitionFade.prototype.initWithDuration = function (duration, scene, color) {
            if (_super.prototype.initWithDuration.call(this, duration, scene)) {
                if (color)
                    this._color = color;
            }
            return true;
        };
        TransitionFade.prototype.onEnter = function () {
            _super.prototype.onEnter.call(this);
            var layerColor = new Laya.Sprite();
            layerColor.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, this._color);
            layerColor.alpha = 0.75;
            this._inScene.visible = false;
            layerColor.zOrder = 2;
            layerColor.name = kSceneFade.toString();
            this.addChild(layerColor);
            var f = this.getChildByName(kSceneFade.toString());
            var actions = new laya.Vector();
            actions.push(laya.FadeIn.create(this._duration / 2));
            actions.push(laya.CallFunc.create(Laya.Handler.create(this, this.hideOutShowIn)));
            actions.push(laya.FadeOut.create(this._duration / 2));
            actions.push(laya.CallFunc.create(Laya.Handler.create(this, this.finish)));
            var seq = laya.Sequence.create(actions);
            f.runAction(seq);
        };
        TransitionFade.prototype.onExit = function () {
            _super.prototype.onExit.call(this);
            this.removeChildByName(kSceneFade.toString());
        };
        return TransitionFade;
    }(TransitionScene));
    laya.TransitionFade = TransitionFade;
})(laya || (laya = {}));
//# sourceMappingURL=TransitionScene.js.map