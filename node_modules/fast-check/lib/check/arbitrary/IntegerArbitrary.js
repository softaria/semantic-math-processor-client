"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var ArbitraryWithShrink_1 = require("./definition/ArbitraryWithShrink");
var BiasedArbitraryWrapper_1 = require("./definition/BiasedArbitraryWrapper");
var Shrinkable_1 = require("./definition/Shrinkable");
var BiasNumeric_1 = require("./helpers/BiasNumeric");
var ShrinkNumeric_1 = require("./helpers/ShrinkNumeric");
var IntegerArbitrary = (function (_super) {
    tslib_1.__extends(IntegerArbitrary, _super);
    function IntegerArbitrary(min, max) {
        var _this = _super.call(this) || this;
        _this.biasedIntegerArbitrary = null;
        _this.min = min === undefined ? IntegerArbitrary.MIN_INT : min;
        _this.max = max === undefined ? IntegerArbitrary.MAX_INT : max;
        return _this;
    }
    IntegerArbitrary.prototype.wrapper = function (value, shrunkOnce) {
        var _this = this;
        return new Shrinkable_1.Shrinkable(value, function () { return _this.shrink(value, shrunkOnce).map(function (v) { return _this.wrapper(v, true); }); });
    };
    IntegerArbitrary.prototype.generate = function (mrng) {
        return this.wrapper(mrng.nextInt(this.min, this.max), false);
    };
    IntegerArbitrary.prototype.shrink = function (value, shrunkOnce) {
        return ShrinkNumeric_1.shrinkNumber(this.min, this.max, value, shrunkOnce === true);
    };
    IntegerArbitrary.prototype.pureBiasedArbitrary = function () {
        if (this.biasedIntegerArbitrary != null) {
            return this.biasedIntegerArbitrary;
        }
        var log2 = function (v) { return Math.floor(Math.log(v) / Math.log(2)); };
        this.biasedIntegerArbitrary = BiasNumeric_1.biasNumeric(this.min, this.max, IntegerArbitrary, log2);
        return this.biasedIntegerArbitrary;
    };
    IntegerArbitrary.prototype.withBias = function (freq) {
        return BiasedArbitraryWrapper_1.biasWrapper(freq, this, function (originalArbitrary) { return originalArbitrary.pureBiasedArbitrary(); });
    };
    IntegerArbitrary.MIN_INT = 0x80000000 | 0;
    IntegerArbitrary.MAX_INT = 0x7fffffff | 0;
    return IntegerArbitrary;
}(ArbitraryWithShrink_1.ArbitraryWithShrink));
function integer(a, b) {
    if (a !== undefined && b !== undefined && a > b)
        throw new Error('fc.integer maximum value should be equal or greater than the minimum one');
    return b === undefined ? new IntegerArbitrary(undefined, a) : new IntegerArbitrary(a, b);
}
exports.integer = integer;
function maxSafeInteger() {
    return integer(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
}
exports.maxSafeInteger = maxSafeInteger;
function nat(a) {
    if (a !== undefined && a < 0)
        throw new Error('fc.nat value should be greater than or equal to 0');
    return new IntegerArbitrary(0, a);
}
exports.nat = nat;
function maxSafeNat() {
    return nat(Number.MAX_SAFE_INTEGER);
}
exports.maxSafeNat = maxSafeNat;
