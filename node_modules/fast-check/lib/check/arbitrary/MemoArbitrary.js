"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var Arbitrary_1 = require("./definition/Arbitrary");
var MemoArbitrary = (function (_super) {
    tslib_1.__extends(MemoArbitrary, _super);
    function MemoArbitrary(underlying) {
        var _this = _super.call(this) || this;
        _this.underlying = underlying;
        _this.lastFreq = -1;
        _this.lastBiased = _this;
        return _this;
    }
    MemoArbitrary.prototype.generate = function (mrng) {
        return this.underlying.generate(mrng);
    };
    MemoArbitrary.prototype.withBias = function (freq) {
        if (freq !== this.lastFreq) {
            this.lastFreq = freq;
            this.lastBiased = this.underlying.withBias(freq);
        }
        return this.lastBiased;
    };
    return MemoArbitrary;
}(Arbitrary_1.Arbitrary));
exports.MemoArbitrary = MemoArbitrary;
var contextRemainingDepth = 10;
exports.memo = function (builder) {
    var previous = {};
    return (function (maxDepth) {
        var n = maxDepth !== undefined ? maxDepth : contextRemainingDepth;
        if (!Object.prototype.hasOwnProperty.call(previous, n)) {
            var prev = contextRemainingDepth;
            contextRemainingDepth = n - 1;
            previous[n] = new MemoArbitrary(builder(n));
            contextRemainingDepth = prev;
        }
        return previous[n];
    });
};
