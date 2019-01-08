module laya {
    const INVALID_TAG:number = -1;
    export class ActionManager {
        protected _targets:Map<HashElement>;
        // protected _targets:Array<HashElement>;
        protected _currentTarget:HashElement;
        protected _currentTargetSalvaged:boolean;

        constructor() {
            this._targets = new Map<HashElement>();
            this._currentTarget = null
            this._currentTargetSalvaged = false;
        }

        public destory() : void {
            this.removeAllActions();
        }

        public addAction(action:Action, target:Laya.Sprite, paused:boolean) : void {
            if(!action) throw new Error("action can't be nullptr! \n");
            if(!target) throw new Error("target can't be nullptr!");
            // if(target.name.length <= 0) throw new Error("target's name can't be nullptr!"); 

            if(!action || !target) return;

            let element:HashElement = null;
            let id = target._getId();
            if(!this._targets || !this._targets.has(target._getId().toString())) {
                element = new HashElement();
                element._paused = paused;
                element._target = target;
               
                // this._targets[target.name] = element;
                this._targets.add(id.toString(), element);
            }else {
                element = this._targets.get(target._getId().toString());
            }

            this.actionAllocWithHashElement(element);
            element._actions.appendObject(action);

            action.startWithTarget(target);
        }

        public removeAllActions() : void {
            let items = this._targets.getItems();
            for (let key in items) {
                if (items.hasOwnProperty(key)) {
                    let target = items[key]._target;
                    this.removeAllActionsFromTarget(target);
                }
            }
        }

        public removeAllActionsFromTarget(target:Laya.Sprite) : void {
            if(!target) return;
            let element:HashElement = this._targets.get(target._getId().toString());

            if(element) {
                if(element._actions.containsObject(target) && (!element._currentActionSalvaged))
                {
                    element._currentActionSalvaged = true;
                }
                element._actions.removeAllObject();
                if(this._currentTarget == element) {
                    this._currentTargetSalvaged = true;
                }
                else {
                    this.deleteHashElement(element);
                }

            }
        }

        public removeAction(action:Action) : void {
            if(!action) return;

            let element:HashElement = null;
            let target = action.getOriginalTarget();
            element = this._targets.get(target._getId().toString());
            if(element) {
                let index = element._actions.getIndexOfObject(action);
                if(index != -1) {
                    this.removeActionAtIndex(index, element);
                }
            }
        }

        public removeActionByTag(tag:number, target:Laya.Sprite) : void {
            if(tag == INVALID_TAG) throw new Error("Invalid tag value!");
            if(target == null) throw new Error("target can't be nullptr!");

            if(target == null) return;

            let element:HashElement = this._targets.get(target._getId().toString());
            if(element) {
                let limit = element._actions._num;
                for(let i = 0; i < limit; ++i) {
                    let action = element._actions._arr[i];
                    if(action.getTag() == tag && action.getOriginalTarget() == target){
                        this.removeActionAtIndex(i, element);
                        break;
                    }
                }
            }

        }

        public removeAllActionsByTag(tag:number, target:Laya.Sprite) : void {
            if(tag == INVALID_TAG) throw new Error("Invalid tag value!");
            if(target == null) throw new Error("target can't be nullptr!");

            if(target == null) return;

            let element:HashElement = this._targets.get(target._getId().toString());
            if(element) {
                let limit = element._actions._num;
                for(let i = 0; i < limit;) {
                    let action:Action = element._actions._arr[i];
                    if(action.getTag() == tag && action.getOriginalTarget() == target){
                        this.removeActionAtIndex(i, element);
                        --limit;
                    }
                    else
                    {
                        ++i;
                    }
                }
            }

        }

        public removeActionsByFlags(flags:number, target:Laya.Sprite) : void {
            if(flags == 0) return;
            if(target == null) throw new Error("target can't be nullptr!");
            if(target == null) return;

            let element:HashElement = this._targets.get(target._getId().toString());
            if(element) {
                let limit = element._actions._num;
                for(let i = 0; i < limit;) {
                    let action:Action = element._actions._arr[i];
                    if((action.getFlags() & flags) != 0 && action.getOriginalTarget() == target)
                    {
                        this.removeActionAtIndex(i, element);
                        --limit;
                    }
                    else {
                        ++i;
                    }
                }
            }
        }

        public getActionByTag(tag:number, target:Laya.Sprite) : Action {
            if(tag == INVALID_TAG) throw new Error("Invalid tag value!");
            let element = this._targets.get(target._getId().toString());
            if(element) {
                if(element._actions != null) {
                    let limit = element._actions._num;
                    for(let i = 0; i < limit; ++i) {
                        let action:Action = element._actions._arr[i];
                        if(action.getTag() == tag) {
                            return action;
                        }
                    }
                }
            }

            return null;
        }


        public getNumberOfRunningActionsInTargetByTag(target:Laya.Sprite, tag:number) : number {
             if(tag == INVALID_TAG) throw new Error("Invalid tag value!");
             let element = this._targets.get(target._getId().toString());
             if(!element || !element._actions) return 0;

             let count = 0;
             let limit = element._actions._num;
             for(let i = 0; i < limit; ++i) {
                 let action:Action = element._actions._arr[i];
                 if(action.getTag() == tag) ++count;
             }

             return count;
        }

        public getNumberOfRunningActions() : number {
            let count = 0;
            for (var key in this._targets) {
                if (this._targets.hasOwnProperty(key)) {
                    var element = this._targets[key];
                    count += element._actions ? element._actions._num : 0;
                }
            }

            return count;
        }

        public pauseTarget(target:Laya.Sprite) : void {
            let element:HashElement = null;
            element = this._targets.get(target._getId().toString());

            if(element) {
                element._paused = true;
            }
        }

        public resumeTarget(target:Laya.Sprite) : void {
            let element:HashElement = null;
            element = this._targets.get(target._getId().toString());

            if(element) {
                element._paused = false;
            } 
        }

        public pauseAllRunningActions() : Vector<Laya.Sprite> {
            let idsWithActions = new Vector<Laya.Sprite>();

            let items = this._targets.getItems();
            for (let key in items) {
                if (items.hasOwnProperty(key)) {
                    let element = items[key];
                    if(!element._paused) {
                        element._paused = true;
                        idsWithActions.push(element._target);
                    }
                }
            }

            return idsWithActions;
        }

        public resumeTargets(targets:Vector<Laya.Sprite>) {
            for(let i = 0; i < targets.size(); ++i) {
                this.resumeTarget(targets.at(i));
            }
        }

        public update(dt:number) : void {
            if(this._targets.size() <= 0) return;
            let items = this._targets.getItems();
            for (let key in items) {
                if (items.hasOwnProperty(key)) {
                    this._currentTarget = items[key];
                    this._currentTargetSalvaged = false;

                    if(!this._currentTarget._paused) {
                        for(this._currentTarget._actionIndex = 0; this._currentTarget._actionIndex < this._currentTarget._actions._num;
                            this._currentTarget._actionIndex++)
                            {
                                this._currentTarget._currentAction = this._currentTarget._actions._arr[this._currentTarget._actionIndex];
                                if (this._currentTarget._currentAction == null) continue;

                                this._currentTarget._currentActionSalvaged = false;
                                this._currentTarget._currentAction.step(dt);

                                if(this._currentTarget._currentActionSalvaged)
                                {
                                    this._currentTarget._currentAction = null;
                                }
                                else if(this._currentTarget._currentAction.isDone()) 
                                {
                                    this._currentTarget._currentAction.stop();
                                    let action = this._currentTarget._currentAction;
                                    this._currentTarget._currentAction = null;
                                    this.removeAction(action);
                                }

                                this._currentTarget._currentAction = null;
                            }
                    }

                    if(this._currentTargetSalvaged && this._currentTarget._actions._num <= 0)
                    {
                        this.deleteHashElement(this._currentTarget);
                    }
                    
                }
            }

            this._currentTarget = null;
        }

        protected removeActionAtIndex(index:number, element:HashElement) : void {
            let action:Action = element._actions._arr[index];

            if(action == element._currentAction && (!element._currentActionSalvaged))
            {
                element._currentActionSalvaged = true;
            }

            element._actions.removeOjbectAtIndex(index);
            if(element._actionIndex >= index) {
                element._actionIndex--;
            }

            if(element._actions._num == 0) {
                if(this._currentTarget == element) {
                    this._currentTargetSalvaged = true;
                }
                else {
                    this.deleteHashElement(element);
                }
            }
        }

        protected deleteHashElement(element:HashElement) : void {
            element._actions.free();
            this._targets.remove(element._target._getId().toString());
            element = null;
        }

        protected actionAllocWithHashElement(element:HashElement) : void {
            if(element._actions == null) {
                element._actions = new ccArray(4);
            }
            else if(element._actions._num == element._actions._max) {
                element._actions.doubleCapacity();
            }
        }
    }

    export class ccArray {
        public _num:number;
        public _max:number;
        public _arr:Array<Action>;
        
        constructor(capacity?:number) {
            this._num = 0;
            this._max = capacity ? capacity : 0;
            this._arr = new Array<Action>();
        }

        public appendObject(object:any) : void {
            if(!object) throw new Error("Invalid parameter!");
            this._arr.push(object);
            this._num++;
        }

        public doubleCapacity() : void {
            this._max *= 2;
        }

        public containsObject(object:any) : boolean {
            return this.getIndexOfObject(object) != -1;
        }

        public getIndexOfObject(object:any) : number {
            for(let i = 0; i < this._num; ++i) {
                if(this._arr[i] == object) return i;
            }

            return -1;
        }

        public removeAllObject() : void {
            while(this._num > 0) {
                delete this._arr[--this._num];
            }
        }

        public removeOjbectAtIndex(index:number, releaseObj:boolean = true) : void {
            if(!this._arr && this._num < 0 && index < 0 && index < this._num) throw new Error("Invalid index. Out of bounds");

            if(releaseObj) {
                this._arr.splice(index, 1);
            }
        }

        public free() : void {
            if(this._arr == null) return;

            this.removeAllObject();
            delete this._arr;
            this._arr = null;
        }
    }

    export class HashElement {
        public _target:Laya.Sprite;
        public _actionIndex:number;
        public _currentAction:Action;
        public _currentActionSalvaged:boolean;
        public _paused:boolean;
        public _actions:ccArray;

        constructor() {
            this._target = null
            this._actionIndex = 0;
            this._currentAction = null;
            this._currentActionSalvaged = false;
            this._paused = false;
            this._actions = null;
        }
    }
}