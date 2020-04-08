"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var ArbitraryWithShrink_1 = require("./definition/ArbitraryWithShrink");
var BiasedArbitraryWrapper_1 = require("./definition/BiasedArbitraryWrapper");
var Shrinkable_1 = require("./definition/Shrinkable");
var BiasNumeric_1 = require("./helpers/BiasNumeric");
var ShrinkNumeric_1 = require("./helpers/ShrinkNumeric");
var BigIntArbitrary = (function (_super) {
    tslib_1.__extends(BigIntArbitrary, _super);
    function BigIntArbitrary(min, max) {
        var _this = _super.call(this) || this;
        _this.min = min;
        _this.max = max;
        _this.biasedBigIntArbitrary = null;
        return _this;
    }
    BigIntArbitrary.prototype.wrapper = function (value, shrunkOnce) {
        var _this = this;
        return new Shrinkable_1.Shrinkable(value, function () { return _this.shrink(value, shrunkOnce).map(function (v) { return _this.wrapper(v, true); }); });
    };
    BigIntArbitrary.prototype.generate = function (mrng) {
        return this.wrapper(mrng.nextBigInt(this.min, this.max), false);
    };
    BigIntArbitrary.prototype.shrink = function (value, shrunkOnce) {
        return ShrinkNumeric_1.shrinkBigInt(this.min, this.max, value, shrunkOnce === true);
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
        this.biasedBigIntArbitrary = BiasNumeric_1.biasNumeric(this.min, this.max, BigIntArbitrary, logLike);
        return this.biasedBigIntArbitrary;
    };
    BigIntArbitrary.prototype.withBias = function (freq) {
        return BiasedArbitraryWrapper_1.biasWrapper(freq, this, function (originalArbitrary) { return originalArbitrary.pureBiasedArbitrary(); });
    };
    return BigIntArbitrary;
}(ArbitraryWithShrink_1.ArbitraryWithShrink));
function bigIntN(n) {
    return new BigIntArbitrary(BigInt(-1) << BigInt(n - 1), (BigInt(1) << BigInt(n - 1)) - BigInt(1));
}
exports.bigIntN = bigIntN;
function bigUintN(n) {
    return new BigIntArbitrary(BigInt(0), (BigInt(1) << BigInt(n)) - BigInt(1));
}
exports.bigUintN = bigUintN;
function bigInt(min, max) {
    return max === undefined ? bigIntN(256) : new BigIntArbitrary(min, max);
}
exports.bigInt = bigInt;
function bigUint(max) {
    return max === undefined ? bigUintN(256) : new BigIntArbitrary(BigInt(0), max);
}
exports.bigUint = bigUint;
