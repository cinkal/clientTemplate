var laya;
(function (laya) {
    var INVALID_TAG = -1;
    var Action = /** @class */ (function () {
        function Action() {
            this._orginalTarget = null;
            this._target = null;
            this._tag = INVALID_TAG;
            this._flags = 0;
        }
        Action.prototype.description = function () {
            return ("<Action | Tag = " + this._tag);
        };
        Action.prototype.startWithTarget = function (aTarget) {
            this._target = aTarget;
            this._orginalTarget = this._target;
        };
        Action.prototype.stop = function () {
            this._target = null;
        };
        Action.prototype.isDone = function () {
            return true;
        };
        Action.prototype.step = function (delta) { };
        Action.prototype.update = function (delta) { };
        Action.prototype.pasue = function () { };
        Action.prototype.resume = function () { };
        Action.prototype.getOriginalTarget = function () {
            return this._orginalTarget;
        };
        Action.prototype.setOriginalTarget = function (originalTarget) {
            this._orginalTarget = originalTarget;
        };
        Action.prototype.getTag = function () {
            return this._tag;
        };
        Action.prototype.setTag = function (tag) {
            this._tag = tag;
        };
        Action.prototype.getFlags = function () {
            return this._flags;
        };
        Action.prototype.setFlags = function (flags) {
            this._flags = flags;
        };
        return Action;
    }());
    laya.Action = Action;
})(laya || (laya = {}));
//# sourceMappingURL=Action.js.map