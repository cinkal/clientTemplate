module laya {

    const FLT_EPSILON:number = 1.192092896e-07;
    export class ActionInterval extends FiniteTimeAction {
        protected _elapsed:number;
        protected _firstTick:boolean;
        protected _callback:Laya.Handler;
        protected _isPause:boolean;
        protected _done:boolean;
       

        constructor() {
            super();
            this._elapsed = 0;
            this._firstTick = false;
            this._callback = null;
            this._isPause = false;
            this._done = false;
            
        }

        public getElapsed() : number {
            return this._elapsed;
        }

        public setAmplitudeRate(amp:number) : void {
            // assert(0, "");
        }

        public getAmplidudeRate() : number {
            return 0;
        }

        public step(dt:number) : void {
            if (this._isPause) return;

            if(this._firstTick) {
                this._firstTick = false;
                this._elapsed = 0;
            }
            else {
                this._elapsed += dt;
            }

            if (this.isDone()) {
                this.stop(); 
                if(this._callback) this._callback.runWith(this._callback.args); 
                return;
            }

            let cc = this._elapsed / Math.max(this._duration, FLT_EPSILON);//进度的时间
            this.update(Math.max(0, Math.min(1, this._elapsed / Math.max(this._duration, FLT_EPSILON))));

            this._done = this._elapsed >= this._duration;
        }

        public startWithTarget(target:Laya.Sprite) : void {
            super.startWithTarget(target);
            this._elapsed = 0;
            this._firstTick = true;
            this._done = false;
        }

        public isDone() : boolean {
            return this._done;
        }

        public initWithDuration(dt?:number) : boolean {
            this._duration = dt;

            if (this._duration == 0) {
                this._duration = FLT_EPSILON;
            }

            this._elapsed = 0;
            this._firstTick = true;

            return true;
        }

        public pasue() : void {
            this._isPause = true;
            super.pasue();
        }

        public resume() : void {
            this._isPause = false;
            super.resume();
        }

        public isPause() :boolean {
            return this._isPause;
        }
        
    }

    export class Sequence extends ActionInterval {
        private _actions:FiniteTimeAction[];
        private _split:number;
        private _last:number;

        constructor() {
            super();
            this._split = 0;
            this._actions = [];
        }

        public destory() : void {
            if(this._actions.length > 0) 
            {
                delete this._actions[0];
                delete this._actions[1];
            }
        }

        public static create(arrayOfActions:Vector<FiniteTimeAction>) : Sequence {
            let ret = new Sequence();
            if(ret && ret.init(arrayOfActions)) {
                return ret;
            }

            ret = null;
            return ret;
        }

        public static createWithArray(...arrayOfActions:FiniteTimeAction[]) :Sequence {
            let ret = new Sequence();
            let vec = new Vector<FiniteTimeAction>();
            for (let i = 0; i < arrayOfActions.length; ++i) {
                vec.push(arrayOfActions[i]);
            }
            if (ret && ret.init(vec)) {
                return ret;
            }
            return null;
        }

        public static createWithTwoActions(actionOne:FiniteTimeAction, actionTwo:FiniteTimeAction) : Sequence {
            let ret = new Sequence();
            if(ret && ret.initWithTwoActions(actionOne, actionTwo))
            {
                return ret;
            }

            ret = null;
            return null;
        } 

        protected init(arrayOfActions:Vector<FiniteTimeAction>) : boolean {
            let count = arrayOfActions.size();
            if(count == 0) return false;

            if(count == 1) return this.initWithTwoActions(arrayOfActions.at(0), ExtraAction.create());

            let prev = arrayOfActions.at(0);
            for(let i = 1; i < count-1; ++i) {
                prev = Sequence.createWithTwoActions(prev, arrayOfActions.at(i));
            }

            return this.initWithTwoActions(prev, arrayOfActions.at(count - 1));
        }

        protected initWithTwoActions(actionOne:FiniteTimeAction, actionTwo:FiniteTimeAction) : boolean {
            if(actionOne == null) throw new Error("actionOne can't be nullptr!");
            if(actionTwo == null) throw new Error("actionTwo can't be nullptr!");

            if(actionOne == null || actionTwo == null) return false;

            let d = actionOne.getDuration() + actionTwo.getDuration();
            super.initWithDuration(d);

            this._actions[0] = actionOne;
            this._actions[1] = actionTwo;

            return true;
        }

        public isDone() : boolean {
            if(this._actions[1]) {
                return (this._done && this._actions[1].isDone());
            }
            else {
                return this._done;
            }
            // return this._done;
        }

        public startWithTarget(target:Laya.Sprite) : void {
            if(!target) { console.log("Sequence::startWithTarget error: target is nullptr!"); return; }

            if(this._actions[0] == null || this._actions[1] == null) {
                console.log("Sequence::startWithTarget error: _actions[0] or _actions[1] is nullptr!");
                return;
            }

            if(this._duration > FLT_EPSILON) {
                this._split = this._actions[0].getDuration() > FLT_EPSILON ? this._actions[0].getDuration() / this._duration : 0;
            }
                
            super.startWithTarget(target);
            this._last = -1;
        }   

        public stop() : void {
            if(this._last != -1 && this._actions[this._last])
            {
                this._actions[this._last].stop();
            }

            super.stop();
        }

        public update(t:number) : void {
            let found = 0;
            let new_t = 0.0;
            if(t < this._split) {
                found = 0;
                if(this._split != 0) {
                    new_t = t / this._split;
                }
                else {
                    new_t = 1;
                } 
            }
            else {
                found = 1;
                if(this._split == 1) {
                    new_t = 1;
                }
                else {
                    new_t = (t - this._split) / (1 - this._split);
                }   
                   
            }

            if(found == 1) {
                if(this._last == -1) {
                    this._actions[0].startWithTarget(this._target);
                    this._actions[0].update(1.0);
                    this._actions[0].stop();
                }
                else if(this._last == 0) {
                    this._actions[0].update(1.0);
                    this._actions[0].stop();
                }
            }
            else if(found == 0 && this._last == 1)
            {
                this._actions[1].update(0);
                this._actions[1].stop();
            }

            if(found == this._last && this._actions[found].isDone())
            {
                return;
            }

            if(found != this._last)
            {
                this._actions[found].startWithTarget(this._target);
            }

            this._actions[found].update(new_t);
            this._last = found;
        }  
    }

    export class ExtraAction extends FiniteTimeAction {
        constructor() {
            super();
        }

        public static create() : ExtraAction {
            let ret = new ExtraAction();
            if(ret) {
                return ret;
            }

            ret = null;
            return null;
        }
    }


    export class MoveBy extends ActionInterval {
        protected _positionDelta:Laya.Point;
        protected _startPosition:Laya.Point;
        protected _previousPosition:Laya.Point;

        constructor() {
            super();
            this._positionDelta = Laya.Point.EMPTY;
            this._startPosition = Laya.Point.EMPTY;
            this._previousPosition = Laya.Point.EMPTY; 
        }

        public static create(duration:number, deltaPosition:Laya.Point) : MoveBy
        {
            let ret = new MoveBy();
            if(ret && ret.initWithDurationWithParam(duration, deltaPosition))
            {
                return ret;
            }

            ret = null;
            return ret;
        }

        public initWithDurationWithParam(duration:number, deltaPosition:Laya.Point) : boolean {
            let ret = false;
            if(super.initWithDuration(duration))
            {
                this._positionDelta = new Laya.Point(deltaPosition.x, deltaPosition.y);
                ret = true;
            }

            return ret;
        }

        public startWithTarget(target:Laya.Sprite) : void {
            super.startWithTarget(target);
            let pos = new Laya.Point(target.x, target.y);
            this._previousPosition = pos;
            this._startPosition = pos;
        }

        public update(delta:number) : void {
            if(this._target) {
                let currentPos = new Laya.Point(this._target.x, this._target.y);
                let t = new Laya.Point();
                let diff = new Laya.Point();
                
                diff.x = currentPos.x - this._previousPosition.x;
                diff.y = currentPos.y - this._previousPosition.y;

                this._startPosition.x = this._startPosition.x + diff.x;
                this._startPosition.y = this._startPosition.y + diff.y;
                
                t.x = this._positionDelta.x * delta;
                t.y = this._positionDelta.y * delta;
                let newPos = new Laya.Point();
                newPos.x = this._startPosition.x + t.x;
                newPos.y = this._startPosition.y + t.y;

                this._target.x = newPos.x;
                this._target.y = newPos.y;
                this._previousPosition = newPos;
            }
        }
    }

    export class MoveTo extends MoveBy {
        protected _endPosition:Laya.Point;
        constructor() {
            super();  
            this._endPosition = null; 
        }

        public static create(duration:number, position:Laya.Point) : MoveTo {
            let ret = new MoveTo();
            if(ret && ret.initWithDurationWithParam(duration, position))
            {
                return ret;
            }

            ret = null;
            return ret;
        }

        public initWithDurationWithParam(duration:number, position:Laya.Point) : boolean {
            let ret = false;
            if(super.initWithDuration(duration))
            {
                this._endPosition = position;
                ret = true;
            }

            return ret;
        }

        public startWithTarget(target:Laya.Sprite) : void {
            super.startWithTarget(target);
            this._positionDelta.x = this._endPosition.x - target.x;
            this._positionDelta.y = this._endPosition.y - target.y;
        }
    }

    export class FadeTo extends ActionInterval {
        protected _toOpacity:number;
        protected _fromOpacity:number;
        constructor() {
            super();
            this._toOpacity = 0;
            this._fromOpacity = 0;
        }

        public static create(duration:number, alpha:number) : FadeTo {
            let ret = new FadeTo();
            if(ret && ret.initWithDurationAndAlpha(duration, alpha)){
                return ret;
            }

            ret = null;
            return null;
        }

        public initWithDurationAndAlpha(duration:number, alpha:number) : boolean {
            if(super.initWithDuration(duration)) {
                this._toOpacity = alpha;
                return true;
            }

            return false;
        }

        public startWithTarget(target:Laya.Sprite) : void {
            super.startWithTarget(target);
            if(target) {
                this._fromOpacity = target.alpha;
            }
        }

        public update(dt:number) : void {
            if(this._target) {
                this._target.alpha = (this._fromOpacity + (this._toOpacity - this._fromOpacity) * dt);
            }
        }
    }

    export class FadeIn extends FadeTo {
        constructor() {
            super();
        }

        public static create(d:number) : FadeIn {
            let ret = new FadeIn();
            if(ret && ret.initWithDurationAndAlpha(d, 255.0)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public startWithTarget(target:Laya.Sprite) : void {
            super.startWithTarget(target);
            target.alpha = 0.0;
            this._toOpacity = 1.0;

            if(target) this._fromOpacity = target.alpha;
        }
    }

    export class FadeOut extends FadeTo {
        constructor() {
            super();
        }

        public static create(d:number) : FadeOut {
            let ret = new FadeOut();
            if(ret && ret.initWithDurationAndAlpha(d, 0.0)) {
                return ret;
            }

            ret = null;
            return null;
        }

        public startWithTarget(target:Laya.Sprite) : void {
            super.startWithTarget(target);

            this._toOpacity = 0.0;

            if(target) this._fromOpacity = target.alpha;
        }
    }

    /** @class JumpBy
     * @brief Moves a Node object simulating a parabolic jump movement by modifying it's position attribute.
    */
    export class JumpBy extends ActionInterval {
        protected _startPosition:Laya.Point;
        protected _delta:Laya.Point;
        protected _height:number;
        protected _jumps:number;
        protected _previousPos:Laya.Point;

        protected constructor() {
            super();
            this._startPosition = null;
            this._delta = null;
            this._height = 0;
            this._jumps = 0;
            this._previousPos = null;
        }
        
        /** 
         * Creates the action.
         * @param duration Duration time, in seconds.
         * @param position The jumping distance.
         * @param height The jumping height.
         * @param jumps The jumping times.
         * @return An autoreleased JumpBy object.
         */
        public static create(duration:number, position:Laya.Point, height:number, jumps:number) :JumpBy {
            let ret = new JumpBy();
            if (ret && ret.initWithDestination(duration, position, height, jumps)) {
                return ret;
            }
            return null;
        }

        public clone() :JumpBy {
            return JumpBy.create(this._duration, this._delta, this._height, this._jumps);
        }

        public reverse() :JumpBy {
            return JumpBy.create(this._duration, new Laya.Point(-this._delta.x, -this._delta.y), this._height, this._jumps);
        }

        public startWithTarget(target:Laya.Sprite) :void {
            super.startWithTarget(target);
            this._startPosition = new Laya.Point(target.x, target.y);
            this._previousPos = this._startPosition;
        }

        /**
         * @param t In seconds.
         */
        public update(t:number) :void {
            if (this._target) {
                let frac = ( t * this._jumps ) % 1;
                let y = this._height * 4 * frac * (1 - frac);
                y += this._delta.y * t;

                let x = this._delta.x * t;
        // #if CC_ENABLE_STACKABLE_ACTIONS
        //         Vec2 currentPos = _target->getPosition();

        //         Vec2 diff = currentPos - _previousPos;
        //         _startPosition = diff + _startPosition;

        //         Vec2 newPos = _startPosition + Vec2(x,y);
        //         _target->setPosition(newPos);

        //         _previousPos = newPos;
        // #else
                this._target.pos(this._startPosition.x + x, this._startPosition.y + y);
            }
        // #endif // !CC_ENABLE_STACKABLE_ACTIONS
        }
        
        /** 
         * initializes the action
         * @param duration in seconds
         */
        public initWithDestination(duration:number, position:Laya.Point, height:number, jumps:number) :boolean {
            if (super.initWithDuration(duration) && jumps >= 0) {
                this._delta = position;
                this._height = height;
                this._jumps = jumps;
                return true;
            }
            return false;
        }
    }

    /** @class JumpTo
     * @brief Moves a Node object to a parabolic position simulating a jump movement by modifying it's position attribute.
    */ 
    export class JumpTo extends JumpBy {
        protected _endPosition:Laya.Point;

        protected constructor() {
            super();
            this._endPosition = null;
        }
        
        /** 
         * Creates the action.
         * @param duration Duration time, in seconds.
         * @param position The jumping destination position.
         * @param height The jumping height.
         * @param jumps The jumping times.
         * @return An autoreleased JumpTo object.
         */
        public static create(duration:number, position:Laya.Point, height:number, jumps:number) :JumpTo {
            let ret = new JumpTo();
            if (ret && ret.initWithDestination(duration, position, height, jumps)) {
                return ret;
            }
            return null;
        }

        public startWithTarget(target:Laya.Sprite) :void {
            super.startWithTarget(target);
            this._delta = new Laya.Point(this._endPosition.x - this._startPosition.x, this._endPosition.y - this._startPosition.y);
        }

        public clone() :JumpTo {
            return JumpTo.create(this._duration, this._delta, this._height, this._jumps);
        }

        public reverse() :JumpTo {
            CONSOLE_LOG("reverse() not supported in JumpTo");
            return null;
        }


        /** 
         * initializes the action
         * @param duration In seconds.
         */
        public initWithDestination(duration:number, position:Laya.Point, height:number, jumps:number) :boolean {
            if (super.initWithDuration(duration) && jumps>=0) {
                this._endPosition = position;
                this._height = height;
                this._jumps = jumps;

                return true;
            }

            return false;
        }
    }

    export class DelayTime extends ActionInterval {
        constructor() {
            super();
        }

        public static create(d?:number) : DelayTime {
            let ret = new DelayTime();
            if(ret && ret.initWithDuration(d)) {
                return ret;
            }

            ret = null;
            return ret;
        }

        public update(dt:number) : void {
            return;
        }

    }


    export class ScaleTo extends ActionInterval {
        protected _scaleX;
        protected _scaleY;
        protected _scaleZ;
        protected _startScaleX;
        protected _startScaleY;
        protected _startScaleZ;
        protected _endScaleX;
        protected _endScaleY;
        protected _endScaleZ;
        protected _deltaX;
        protected _deltaY;
        protected _deltaZ;

        constructor() {
            super();
            this._scaleX = 0.0;
            this._scaleY = 0.0;
            this._scaleZ = 0.0;
            this._startScaleX = 0.0;
            this._startScaleY = 0.0;
            this._startScaleZ = 0.0;
            this._endScaleX = 0.0;
            this._endScaleY = 0.0;
            this._endScaleZ = 0.0;
            this._deltaX = 0.0;
            this._deltaY = 0.0;
            this._deltaZ = 0.0;
        }

        public static create(duration?:number, s?:number) : ScaleTo {
            let ret = new ScaleTo();
            if(ret && ret.initWithDurationWithParam(duration, s)) {

                return ret;
            }

            ret = null;
            return ret;
        }

        public static createWithXY(duration?:number, sx?:number, sy?:number) : ScaleTo {
            let ret = new ScaleTo();
            if(ret && ret.initWithDurationWithXY(duration, sx, sy)) {
                return ret;
            }
            ret = null;
            return null;
        }

        public static createWithXYZ(duration?:number, sx?:number, sy?:number, sz?:number) : ScaleTo {
            let ret = new ScaleTo();
            if(ret && ret.initWithDurationWithXYZ(duration, sx, sy, sz)) {
                return ret;
            }
            ret = null;
            return null;
        }

        public initWithDurationWithParam(duration?:number, s?:number) : boolean {
            if(super.initWithDuration(duration)) {
                this._endScaleX = s;
                this._endScaleY = s;
                this._endScaleZ = s;

                return true;
            }

            return false;
        }

        public initWithDurationWithXY(duration?:number, sx?:number, sy?:number) : boolean {
            if(super.initWithDuration(duration)) {
                this._endScaleX = sx;
                this._endScaleY = sy;
                this._endScaleZ = 1.0;

                return true;
            }

            return false;
        }   

        public initWithDurationWithXYZ(duration?:number, sx?:number, sy?:number, sz?:number) {
            if(super.initWithDuration(duration)) {
                this._endScaleX = sx;
                this._endScaleY = sy;
                this._endScaleZ = sz;
                
                return true;
            }

            return false;
        }

        public startWithTarget(target:Laya.Sprite) : void {
            super.startWithTarget(target);
            this._startScaleX = target.scaleX;
            this._startScaleY = target.scaleY;
            this._startScaleZ = 1.0;

            this._deltaX = this._endScaleX - this._startScaleX;
            this._deltaY = this._endScaleY - this._startScaleY;
            this._deltaZ = 1.0;
        }

        public update(dt:number) : void {
            if(this._target) {
                this._target.scaleX = (this._startScaleX + this._deltaX * dt);
                this._target.scaleY = (this._startScaleY + this._deltaY * dt);
            }
        }
    }

    export class ScaleBy extends ScaleTo {
        constructor() {
            super();
        }

        public static create(duration?:number, s?:number) : ScaleBy {
            let ret = new ScaleBy();
            if(ret && ret.initWithDurationWithParam(duration, s)) {

                return ret;
            }

            ret = null;
            return ret;
        }

        public static createWithXY(duration?:number, sx?:number, sy?:number) : ScaleBy {
            let ret = new ScaleBy();
            if(ret && ret.initWithDurationWithXY(duration, sx, sy)) {
                return ret;
            }
            ret = null;
            return null;
        }

        public startWithTarget(target: Laya.Sprite): void {
            super.startWithTarget(target);
            this._startScaleX = target.scaleX;
            this._scaleY = target.scaleY;
            this._scaleZ = 1.0;

            this._deltaX = this._startScaleX * this._endScaleX - this._startScaleX;
            this._deltaY = this._startScaleY * this._endScaleY - this._startScaleY;
            this._deltaZ = 1.0;
        }
    }

    export class ResizeTo extends ActionInterval {
        protected _fromWidth;
        protected _fromHeight;
        protected _toWidth;
        protected _toHeight;

        constructor() {
            super();
            this._fromWidth = 0;
            this._fromHeight = 0;
            this._toWidth = 0;
            this._toHeight = 0;
        }

        public static create(duration:number, width:number, height:number) : ResizeTo {
            let ret = new ResizeTo();
            if(ret && ret.initWithDurationAndSize(duration, width, height)){
                return ret;
            }

            ret = null;
            return null;
        }

        public initWithDurationAndSize(duration:number, width:number, height:number) : boolean {
            if(super.initWithDuration(duration)) {
                this._toWidth = width;
                this._toHeight = height;
                return true;
            }

            return false;
        }

        public startWithTarget(target:Laya.Sprite) : void {
            super.startWithTarget(target);
            if(target) {
                this._fromWidth = target.width;
                this._fromHeight = target.height;
            }
        }

        public update(dt:number) : void {
            if(this._target) {
                this._target.width = this._fromWidth + (this._toWidth - this._fromWidth) * dt;
                this._target.height = this._fromHeight + (this._toHeight - this._fromHeight) * dt;
            }
        }
    }

    export class Shake extends ActionInterval {
        // Initial position of the shaked node
        // 精灵的位置
        protected _initial_x;
        protected _initial_y;
        // Strength of the action
        // 抖动的幅度
        protected _strength_x;
        protected _strength_y;

        constructor() {
            super();
             this._strength_x = 0;
             this._strength_y = 0;
             this._initial_x = 0;
             this._initial_y = 0;
        }
        // Create the action with a time and a strength (same in x and y)
        // 产生震动效果的初始化函数参数,两个方向相同
        // @param d 震动持续的时间
        // @param strength 震动的幅度
        public static create(d:number, strength:number) : Shake {
            return this.create1( d, strength, strength );
        }
        
        public static create1(duration:number, strength_x:number, strength_y:number) : Shake {
            let p_action = new Shake();
            if (p_action && p_action.initWithDurationAndStrength(duration, strength_x, strength_y)) {
                return p_action;
            }
            p_action = null;
            return p_action;
        }

        public initWithDurationAndStrength(duration:number, strength_x:number, strength_y:number) : boolean {
            if (super.initWithDuration(duration)){
                this._strength_x = strength_x;
                this._strength_y = strength_y;
                
                return true;
            }
            
            return false;
        }

        // Helper function. I included it here so that you can compile the whole file
        // it returns a random value between min and max included
        public fgRangeRand(min:number, max:number ) : number {
            return random(min, max);
        }
        
        public update(time:number) : void {
            let randx = this.fgRangeRand( -this._strength_x, this._strength_x );
            let randy = this.fgRangeRand( -this._strength_y, this._strength_y );
            
            // move the target to a shaked position
            this._target.pos(this._initial_x + randx,
                                    this._initial_y + randy);
        }
        
        public clone() : Shake {
            let a = new Shake();
            if (a && a.initWithDurationAndStrength(this._duration, this._strength_x, this._strength_y)) {
                return a;
            }
            a = null;
            return a;
        }
        
        public reverse() : Shake {
            return Shake.create1(this._duration, -this._strength_x, -this._strength_y);
        }
        
        public startWithTarget(target:Laya.Sprite) : void {
            super.startWithTarget(target);
            
            // save the initial position
            this._initial_x = target.x;
            this._initial_y = target.y;
        }
        
        public stop() : void {
            // Action is done, reset clip position
            if (!this._target) return;
            this._target.pos(this._initial_x, this._initial_y);
            
            super.stop();
        }
    }

    export class RepeatForever extends ActionInterval {
        protected m_pInnerAction;

        constructor() {
            super();
            this.m_pInnerAction = null;
        }

        public static create(pAction:ActionInterval) : RepeatForever {
            let pRet = new RepeatForever();
            if (pRet && pRet.initWithAction(pAction))
            {
                return pRet;
            }
            pRet = null;
            return null;
        }

        public initWithAction(pAction:ActionInterval) : boolean {
            // CCAssert(pAction != NULL, "");
            // pAction->retain();
            this.m_pInnerAction = pAction;
            return true;
        }

        public startWithTarget(pTarget:Laya.Sprite) : void
        {
            super.startWithTarget(pTarget);
            this.m_pInnerAction.startWithTarget(pTarget);
        }

        public step(dt:number) : void
        {
            this.m_pInnerAction.step(dt);
            if (this.m_pInnerAction.isDone())
            {
                let diff = this.m_pInnerAction.getElapsed() - this.m_pInnerAction.getDuration();
                this.m_pInnerAction.startWithTarget(this._target);
                // to prevent jerk. issue #390, 1247
                this.m_pInnerAction.step(0);
                this.m_pInnerAction.step(diff);
            }
        }

        public isDone() : boolean
        {
            return false;
        }

        public reverse() : ActionInterval
        {
            return RepeatForever.create(this.m_pInnerAction.reverse());
        }
    }

//
// Spawn
//
    export class Spawn extends ActionInterval {
        protected m_pOne:FiniteTimeAction;
        protected m_pTwo:FiniteTimeAction;

        constructor() {
            super();
            this.m_pOne = null;
            this.m_pTwo = null;
        }


        public static create(...arrayOfActions:Array<FiniteTimeAction>) : Spawn
        {
            let pRet:Spawn = null;
            do 
            {
                let count = arrayOfActions.length;
                if (count <= 0) {CONSOLE_LOG("create Spawn and arrayOfActions count == 0"); return null;}
                let prev = arrayOfActions[0];
                if (count > 1)
                {
                    for (let i = 1; i < arrayOfActions.length; ++i)
                    {
                        prev = Spawn.createWithTwoActions(prev, arrayOfActions[i]);
                    }
                }
                else
                {
                    // If only one action is added to CCSpawn, make up a CCSpawn by adding a simplest finite time action.
                    prev = Spawn.createWithTwoActions(prev, ExtraAction.create());
                }
                pRet = <Spawn>prev;
            }while (0);

            return pRet;
        }

        public static createWithTwoActions(pAction1:FiniteTimeAction, pAction2:FiniteTimeAction) : Spawn
        {
            let pSpawn = new Spawn();
            if (pSpawn && pSpawn.initWithTwoActions(pAction1, pAction2)) {
                return pSpawn;
            }
            pSpawn = null;
            return pSpawn;
        }

        public initWithTwoActions(pAction1:FiniteTimeAction, pAction2:FiniteTimeAction) : boolean
        {
            if (pAction1 == null || pAction2 == null) {
                console.log("create Spawn and initWithTwoActions pAction1 or pAction2 == null");
                return false;
            }

            let bRet = false;

            let d1 = pAction1.getDuration();
            let d2 = pAction2.getDuration();

            if (super.initWithDuration(Math.max(d1, d2)))
            {
                this.m_pOne = pAction1;
                this.m_pTwo = pAction2;

                if (d1 > d2)
                {
                    this.m_pTwo = Sequence.createWithTwoActions(pAction2, DelayTime.create(d1 - d2));
                } 
                else if (d1 < d2)
                {
                    this.m_pOne = Sequence.createWithTwoActions(pAction1, DelayTime.create(d2 - d1));
                }
                bRet = true;
            }
            
            return bRet;
        }

        public startWithTarget(pTarget:Laya.Sprite) : void
        {
            super.startWithTarget(pTarget);
            this.m_pOne.startWithTarget(pTarget);
            this.m_pTwo.startWithTarget(pTarget);
        }

        public stop() : void
        {
            this.m_pOne.stop();
            this.m_pTwo.stop();
            super.stop();
        }

        public update(time:number) : void
        {
            if (this.m_pOne)
            {
                this.m_pOne.update(time);
            }
            if (this.m_pTwo)
            {
                this.m_pTwo.update(time);
            }
        }

        public reverse() : ActionInterval
        {
            console.log("Spawn is not support");
            return null;
            // return Spawn.createWithTwoActions((<Spawn>this.m_pOne).reverse(), this.m_pTwo.reverse());
        }
    }

    export class RotateTo extends ActionInterval {
        protected m_fDstAngle:number;
        protected m_fDiffAngle:number;
        protected m_fStartAngle:number;

        constructor() {
            super();
            this.m_fDstAngle = 0;
            this.m_fStartAngle = 0;
            this.m_fDiffAngle = 0;
        }

        public static create(fDuration:number, fDeltaAngle:number)
        {
            let pRotateTo = new RotateTo();
            if (pRotateTo && pRotateTo.initWithDurationAndAngle(fDuration, fDeltaAngle)) {
                return pRotateTo;
            }
            pRotateTo = null;
            return pRotateTo;
        }

        public initWithDurationAndAngle(fDuration:number, fDeltaAngle:number) : boolean
        {
            if (super.initWithDuration(fDuration))
            {
                this.m_fDstAngle = fDeltaAngle;
                return true;
            }

            return false;
        }

        public startWithTarget(pTarget:Laya.Sprite) : void
        {
            super.startWithTarget(pTarget);
            
            // Calculate X
            this.m_fStartAngle = pTarget.rotation;
            if (this.m_fStartAngle > 0)
            {
                this.m_fStartAngle = this.m_fStartAngle % 360.0;
            }
            else
            {
                this.m_fStartAngle = this.m_fStartAngle % -360.0;
            }

            this.m_fDiffAngle = this.m_fDstAngle - this.m_fStartAngle;
            if (this.m_fDiffAngle > 180)
            {
                this.m_fDiffAngle -= 360;
            }
            if (this.m_fDiffAngle < -180)
            {
                this.m_fDiffAngle += 360;
            }
        }

        public update(time:number) : void
        {
            if (this._target)
            {
                this._target.rotation = this.m_fStartAngle + this.m_fDiffAngle * time;
            }
        }
    }

    export class Speed extends ActionInterval {
        protected m_fSpeed:number;
        protected m_pInnerAction:ActionInterval;

        constructor() {
            super();
            this.m_fSpeed = 0;
            this.m_pInnerAction = null;
        }

        public static create(pAction:ActionInterval, fSpeed:number) : Speed {
            let pRet = new Speed();
            if (pRet && pRet.initWithAction(pAction, fSpeed))
            {
                return pRet;
            }
            pRet = null;
            return null;
        }

        public initWithAction(pAction:ActionInterval, fSpeed:number) : boolean
        {
            if (pAction == null) return false;
            this.m_pInnerAction = pAction;
            this.m_fSpeed = fSpeed;    
            return true;
        }

        public startWithTarget(pTarget:Laya.Sprite) : void
        {
            super.startWithTarget(pTarget);
            this.m_pInnerAction.startWithTarget(pTarget);
        }

        public stop() : void
        {
            this.m_pInnerAction.stop();
            super.stop();
        }

        public step(dt:number) : void
        {
            this.m_pInnerAction.step(dt * this.m_fSpeed);
        }

        public isDone() : boolean
        {
            return this.m_pInnerAction.isDone();
        }

        public reverse() : ActionInterval
        {
            return null;
            //return <ActionInterval>(Speed.create(this.m_pInnerAction.reverse(), this.m_fSpeed));
        }

        public setInnerAction(pAction:ActionInterval) : void
        {
            if (this.m_pInnerAction != pAction)
            {
                delete this.m_pInnerAction;
                this.m_pInnerAction = null;
                this.m_pInnerAction = pAction;
            }
        }
    }


    export class Blink extends ActionInterval {
        protected m_nTimes:number;
        protected m_bOriginalState:boolean;

            /** initializes the action */
        public initWithDurationWithBlink(duration:number, uBlinks:number) : boolean
        {
            if (super.initWithDuration(duration))
            {
                this.m_nTimes = uBlinks;
                return true;
            }

            return false;
        }

        public static create(duration:number, uBlinks:number) : Blink
        {
            let pBlink = new Blink();
            pBlink.initWithDurationWithBlink(duration, uBlinks);

            return pBlink;
        }

        public stop() : void
        {
            this._target.visible = this.m_bOriginalState;
            super.stop();
        }

        public startWithTarget(pTarget:Laya.Sprite) : void
        {
            super.startWithTarget(pTarget);
            this.m_bOriginalState = pTarget.visible;
        }

        public update(time:number) : void
        {
            if (this._target && ! this.isDone())
            {
                let slice = 1.0 / this.m_nTimes;
                let m = time % slice;
                this._target.visible = m > slice / 2 ? true : false;
            }
        }

        // public reverse() : void
        // {
        //     // return 'self'
        //     return Blink.create(this.m_fDuration, this.m_nTimes);
        // }
    } 


}