import { __extends } from "tslib";
import { ArbitraryWithShrink } from './definition/ArbitraryWithShrink.js';
import { biasWrapper } from './definition/BiasedArbitraryWrapper.js';
import { Shrinkable } from './definition/Shrinkable.js';
import { biasNumeric } from './helpers/BiasNumeric.js';
import { shrinkBigInt } from './helpers/ShrinkNumeric.js';
var BigIntArbitrary = (function (_super) {
    __extends(BigIntArbitrary, _super);
    function BigIntArbitrary(min, max) {
        var _this = _super.call(this) || this;
        _this.min = min;
        _this.max = max;
        _this.biasedBigIntArbitrary = null;
        return _this;
    }
    BigIntArbitrary.prototype.wrapper = function (value, shrunkOnce) {
        var _this = this;
        return new Shrinkable(value, function () { return _this.shrink(value, shrunkOnce).map(function (v) { return _this.wrapper(v, true); }); });
    };
    BigIntArbitrary.prototype.generate = function (mrng) {
        return this.wrapper(mrng.nextBigInt(this.min, this.max), false);
    };
    BigIntArbitrary.prototype.shrink = function (value, shrunkOnce) {
        return shrinkBigInt(this.min, this.max, value, shrunkOnce === true);
    };
    BigIntArbitrary.prototype.pureBiasedArbitrary = function () {
        if (this.biasedBigIntArbitrary != null) {
            return this.biasedBigIntArbitrary;
        }
        var logLike = function (v) {
            if (v === BigInt(0))
                return BigInt(0);
            return BigInt(v.toString().length);
        };
        this.biasedBigIntArbitrary = biasNumeric(this.min, this.max, BigIntArbitrary, logLike);
        return this.biasedBigIntArbitrary;
    };
    BigIntArbitrary.prototype.withBias = function (freq) {
        return biasWrapper(freq, this, function (originalArbitrary) { return originalArbitrary.pureBiasedArbitrary(); });
    };
    return BigIntArbitrary;
}(ArbitraryWithShrink));
function bigIntN(n) {
    return new BigIntArbitrary(BigInt(-1) << BigInt(n - 1), (BigInt(1) << BigInt(n - 1)) - BigInt(1));
}
function bigUintN(n) {
    return new BigIntArbitrary(BigInt(0), (BigInt(1) << BigInt(n)) - BigInt(1));
}
function bigInt(min, max) {
    return max === undefined ? bigIntN(256) : new BigIntArbitrary(min, max);
}
function bigUint(max) {
    return max === undefined ? bigUintN(256) : new BigIntArbitrary(BigInt(0), max);
}
export { bigIntN, bigUintN, bigInt, bigUint };
