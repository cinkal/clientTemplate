var laya;
(function (laya) {
    var INVALID_TAG = -1;
    var ActionManager = /** @class */ (function () {
        function ActionManager() {
            this._targets = new laya.Map();
            this._currentTarget = null;
            this._currentTargetSalvaged = false;
        }
        ActionManager.prototype.destory = function () {
            this.removeAllActions();
        };
        ActionManager.prototype.addAction = function (action, target, paused) {
            if (!action)
                throw new Error("action can't be nullptr! \n");
            if (!target)
                throw new Error("target can't be nullptr!");
            // if(target.name.length <= 0) throw new Error("target's name can't be nullptr!"); 
            if (!action || !target)
                return;
            var element = null;
            var id = target._getId();
            if (!this._targets || !this._targets.has(target._getId().toString())) {
                element = new HashElement();
                element._paused = paused;
                element._target = target;
                // this._targets[target.name] = element;
                this._targets.add(id.toString(), element);
            }
            else {
                element = this._targets.get(target._getId().toString());
            }
            this.actionAllocWithHashElement(element);
            element._actions.appendObject(action);
            action.startWithTarget(target);
        };
        ActionManager.prototype.removeAllActions = function () {
            var items = this._targets.getItems();
            for (var key in items) {
                if (items.hasOwnProperty(key)) {
                    var target = items[key]._target;
                    this.removeAllActionsFromTarget(target);
                }
            }
        };
        ActionManager.prototype.removeAllActionsFromTarget = function (target) {
            if (!target)
                return;
            var element = this._targets.get(target._getId().toString());
            if (element) {
                if (element._actions.containsObject(target) && (!element._currentActionSalvaged)) {
                    element._currentActionSalvaged = true;
                }
                element._actions.removeAllObject();
                if (this._currentTarget == element) {
                    this._currentTargetSalvaged = true;
                }
                else {
                    this.deleteHashElement(element);
                }
            }
        };
        ActionManager.prototype.removeAction = function (action) {
            if (!action)
                return;
            var element = null;
            var target = action.getOriginalTarget();
            element = this._targets.get(target._getId().toString());
            if (element) {
                var index = element._actions.getIndexOfObject(action);
                if (index != -1) {
                    this.removeActionAtIndex(index, element);
                }
            }
        };
        ActionManager.prototype.removeActionByTag = function (tag, target) {
            if (tag == INVALID_TAG)
                throw new Error("Invalid tag value!");
            if (target == null)
                throw new Error("target can't be nullptr!");
            if (target == null)
                return;
            var element = this._targets.get(target._getId().toString());
            if (element) {
                var limit = element._actions._num;
                for (var i = 0; i < limit; ++i) {
                    var action = element._actions._arr[i];
                    if (action.getTag() == tag && action.getOriginalTarget() == target) {
                        this.removeActionAtIndex(i, element);
                        break;
                    }
                }
            }
        };
        ActionManager.prototype.removeAllActionsByTag = function (tag, target) {
            if (tag == INVALID_TAG)
                throw new Error("Invalid tag value!");
            if (target == null)
                throw new Error("target can't be nullptr!");
            if (target == null)
                return;
            var element = this._targets.get(target._getId().toString());
            if (element) {
                var limit = element._actions._num;
                for (var i = 0; i < limit;) {
                    var action = element._actions._arr[i];
                    if (action.getTag() == tag && action.getOriginalTarget() == target) {
                        this.removeActionAtIndex(i, element);
                        --limit;
                    }
                    else {
                        ++i;
                    }
                }
            }
        };
        ActionManager.prototype.removeActionsByFlags = function (flags, target) {
            if (flags == 0)
                return;
            if (target == null)
                throw new Error("target can't be nullptr!");
            if (target == null)
                return;
            var element = this._targets.get(target._getId().toString());
            if (element) {
                var limit = element._actions._num;
                for (var i = 0; i < limit;) {
                    var action = element._actions._arr[i];
                    if ((action.getFlags() & flags) != 0 && action.getOriginalTarget() == target) {
                        this.removeActionAtIndex(i, element);
                        --limit;
                    }
                    else {
                        ++i;
                    }
                }
            }
        };
        ActionManager.prototype.getActionByTag = function (tag, target) {
            if (tag == INVALID_TAG)
                throw new Error("Invalid tag value!");
            var element = this._targets.get(target._getId().toString());
            if (element) {
                if (element._actions != null) {
                    var limit = element._actions._num;
                    for (var i = 0; i < limit; ++i) {
                        var action = element._actions._arr[i];
                        if (action.getTag() == tag) {
                            return action;
                        }
                    }
                }
            }
            return null;
        };
        ActionManager.prototype.getNumberOfRunningActionsInTargetByTag = function (target, tag) {
            if (tag == INVALID_TAG)
                throw new Error("Invalid tag value!");
            var element = this._targets.get(target._getId().toString());
            if (!element || !element._actions)
                return 0;
            var count = 0;
            var limit = element._actions._num;
            for (var i = 0; i < limit; ++i) {
                var action = element._actions._arr[i];
                if (action.getTag() == tag)
                    ++count;
            }
            return count;
        };
        ActionManager.prototype.getNumberOfRunningActions = function () {
            var count = 0;
            for (var key in this._targets) {
                if (this._targets.hasOwnProperty(key)) {
                    var element = this._targets[key];
                    count += element._actions ? element._actions._num : 0;
                }
            }
            return count;
        };
        ActionManager.prototype.pauseTarget = function (target) {
            var element = null;
            element = this._targets.get(target._getId().toString());
            if (element) {
                element._paused = true;
            }
        };
        ActionManager.prototype.resumeTarget = function (target) {
            var element = null;
            element = this._targets.get(target._getId().toString());
            if (element) {
                element._paused = false;
            }
        };
        ActionManager.prototype.pauseAllRunningActions = function () {
            var idsWithActions = new laya.Vector();
            var items = this._targets.getItems();
            for (var key in items) {
                if (items.hasOwnProperty(key)) {
                    var element = items[key];
                    if (!element._paused) {
                        element._paused = true;
                        idsWithActions.push(element._target);
                    }
                }
            }
            return idsWithActions;
        };
        ActionManager.prototype.resumeTargets = function (targets) {
            for (var i = 0; i < targets.size(); ++i) {
                this.resumeTarget(targets.at(i));
            }
        };
        ActionManager.prototype.update = function (dt) {
            if (this._targets.size() <= 0)
                return;
            var items = this._targets.getItems();
            for (var key in items) {
                if (items.hasOwnProperty(key)) {
                    this._currentTarget = items[key];
                    this._currentTargetSalvaged = false;
                    if (!this._currentTarget._paused) {
                        for (this._currentTarget._actionIndex = 0; this._currentTarget._actionIndex < this._currentTarget._actions._num; this._currentTarget._actionIndex++) {
                            this._currentTarget._currentAction = this._currentTarget._actions._arr[this._currentTarget._actionIndex];
                            if (this._currentTarget._currentAction == null)
                                continue;
                            this._currentTarget._currentActionSalvaged = false;
                            this._currentTarget._currentAction.step(dt);
                            if (this._currentTarget._currentActionSalvaged) {
                                this._currentTarget._currentAction = null;
                            }
                            else if (this._currentTarget._currentAction.isDone()) {
                                this._currentTarget._currentAction.stop();
                                var action = this._currentTarget._currentAction;
                                this._currentTarget._currentAction = null;
                                this.removeAction(action);
                            }
                            this._currentTarget._currentAction = null;
                        }
                    }
                    if (this._currentTargetSalvaged && this._currentTarget._actions._num <= 0) {
                        this.deleteHashElement(this._currentTarget);
                    }
                }
            }
            this._currentTarget = null;
        };
        ActionManager.prototype.removeActionAtIndex = function (index, element) {
            var action = element._actions._arr[index];
            if (action == element._currentAction && (!element._currentActionSalvaged)) {
                element._currentActionSalvaged = true;
            }
            element._actions.removeOjbectAtIndex(index);
            if (element._actionIndex >= index) {
                element._actionIndex--;
            }
            if (element._actions._num == 0) {
                if (this._currentTarget == element) {
                    this._currentTargetSalvaged = true;
                }
                else {
                    this.deleteHashElement(element);
                }
            }
        };
        ActionManager.prototype.deleteHashElement = function (element) {
            element._actions.free();
            this._targets.remove(element._target._getId().toString());
            element = null;
        };
        ActionManager.prototype.actionAllocWithHashElement = function (element) {
            if (element._actions == null) {
                element._actions = new ccArray(4);
            }
            else if (element._actions._num == element._actions._max) {
                element._actions.doubleCapacity();
            }
        };
        return ActionManager;
    }());
    laya.ActionManager = ActionManager;
    var ccArray = /** @class */ (function () {
        function ccArray(capacity) {
            this._num = 0;
            this._max = capacity ? capacity : 0;
            this._arr = new Array();
        }
        ccArray.prototype.appendObject = function (object) {
            if (!object)
                throw new Error("Invalid parameter!");
            this._arr.push(object);
            this._num++;
        };
        ccArray.prototype.doubleCapacity = function () {
            this._max *= 2;
        };
        ccArray.prototype.containsObject = function (object) {
            return this.getIndexOfObject(object) != -1;
        };
        ccArray.prototype.getIndexOfObject = function (object) {
            for (var i = 0; i < this._num; ++i) {
                if (this._arr[i] == object)
                    return i;
            }
            return -1;
        };
        ccArray.prototype.removeAllObject = function () {
            while (this._num > 0) {
                delete this._arr[--this._num];
            }
        };
        ccArray.prototype.removeOjbectAtIndex = function (index, releaseObj) {
            if (releaseObj === void 0) { releaseObj = true; }
            if (!this._arr && this._num < 0 && index < 0 && index < this._num)
                throw new Error("Invalid index. Out of bounds");
            if (releaseObj) {
                this._arr.splice(index, 1);
            }
        };
        ccArray.prototype.free = function () {
            if (this._arr == null)
                return;
            this.removeAllObject();
            delete this._arr;
            this._arr = null;
        };
        return ccArray;
    }());
    laya.ccArray = ccArray;
    var HashElement = /** @class */ (function () {
        function HashElement() {
            this._target = null;
            this._actionIndex = 0;
            this._currentAction = null;
            this._currentActionSalvaged = false;
            this._paused = false;
            this._actions = null;
        }
        return HashElement;
    }());
    laya.HashElement = HashElement;
})(laya || (laya = {}));
//# sourceMappingURL=ActionManager.js.map