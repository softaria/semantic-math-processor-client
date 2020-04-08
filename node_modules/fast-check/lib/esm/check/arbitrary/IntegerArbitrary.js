import { __extends } from "tslib";
import { ArbitraryWithShrink } from './definition/ArbitraryWithShrink.js';
import { biasWrapper } from './definition/BiasedArbitraryWrapper.js';
import { Shrinkable } from './definition/Shrinkable.js';
import { biasNumeric } from './helpers/BiasNumeric.js';
import { shrinkNumber } from './helpers/ShrinkNumeric.js';
var IntegerArbitrary = (function (_super) {
    __extends(IntegerArbitrary, _super);
    function IntegerArbitrary(min, max) {
        var _this = _super.call(this) || this;
        _this.biasedIntegerArbitrary = null;
        _this.min = min === undefined ? IntegerArbitrary.MIN_INT : min;
        _this.max = max === undefined ? IntegerArbitrary.MAX_INT : max;
        return _this;
    }
    IntegerArbitrary.prototype.wrapper = function (value, shrunkOnce) {
        var _this = this;
        return new Shrinkable(value, function () { return _this.shrink(value, shrunkOnce).map(function (v) { return _this.wrapper(v, true); }); });
    };
    IntegerArbitrary.prototype.generate = function (mrng) {
        return this.wrapper(mrng.nextInt(this.min, this.max), false);
    };
    IntegerArbitrary.prototype.shrink = function (value, shrunkOnce) {
        return shrinkNumber(this.min, this.max, value, shrunkOnce === true);
    };
    IntegerArbitrary.prototype.pureBiasedArbitrary = function () {
        if (this.biasedIntegerArbitrary != null) {
            return this.biasedIntegerArbitrary;
        }
        var log2 = function (v) { return Math.floor(Math.log(v) / Math.log(2)); };
        this.biasedIntegerArbitrary = biasNumeric(this.min, this.max, IntegerArbitrary, log2);
        return this.biasedIntegerArbitrary;
    };
    IntegerArbitrary.prototype.withBias = function (freq) {
        return biasWrapper(freq, this, function (originalArbitrary) { return originalArbitrary.pureBiasedArbitrary(); });
    };
    IntegerArbitrary.MIN_INT = 0x80000000 | 0;
    IntegerArbitrary.MAX_INT = 0x7fffffff | 0;
    return IntegerArbitrary;
}(ArbitraryWithShrink));
function integer(a, b) {
    if (a !== undefined && b !== undefined && a > b)
        throw new Error('fc.integer maximum value should be equal or greater than the minimum one');
    return b === undefined ? new IntegerArbitrary(undefined, a) : new IntegerArbitrary(a, b);
}
function maxSafeInteger() {
    return integer(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
}
function nat(a) {
    if (a !== undefined && a < 0)
        throw new Error('fc.nat value should be greater than or equal to 0');
    return new IntegerArbitrary(0, a);
}
function maxSafeNat() {
    return nat(Number.MAX_SAFE_INTEGER);
}
export { integer, nat, maxSafeInteger, maxSafeNat };
