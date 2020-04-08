import { Stream } from '../../../stream/Stream.js';
import { cloneMethod, hasCloneMethod } from '../../symbols.js';
var Shrinkable = (function () {
    function Shrinkable(value_, shrink) {
        if (shrink === void 0) { shrink = function () { return Stream.nil(); }; }
        this.value_ = value_;
        this.shrink = shrink;
        this.hasToBeCloned = hasCloneMethod(value_);
        this.readOnce = false;
        Object.defineProperty(this, 'value', { get: this.getValue });
    }
    Shrinkable.prototype.getValue = function () {
        if (this.hasToBeCloned) {
            if (!this.readOnce) {
                this.readOnce = true;
                return this.value_;
            }
            return this.value_[cloneMethod]();
        }
        return this.value_;
    };
    Shrinkable.prototype.applyMapper = function (mapper) {
        var _this = this;
        if (this.hasToBeCloned) {
            var out = mapper(this.value);
            if (out instanceof Object) {
                out[cloneMethod] = function () { return mapper(_this.value); };
            }
            return out;
        }
        return mapper(this.value);
    };
    Shrinkable.prototype.map = function (mapper) {
        var _this = this;
        return new Shrinkable(this.applyMapper(mapper), function () { return _this.shrink().map(function (v) { return v.map(mapper); }); });
    };
    Shrinkable.prototype.filter = function (refinement) {
        var _this = this;
        var refinementOnShrinkable = function (s) {
            return refinement(s.value);
        };
        return new Shrinkable(this.value, function () {
            return _this.shrink()
                .filter(refinementOnShrinkable)
                .map(function (v) { return v.filter(refinement); });
        });
    };
    return Shrinkable;
}());
export { Shrinkable };
