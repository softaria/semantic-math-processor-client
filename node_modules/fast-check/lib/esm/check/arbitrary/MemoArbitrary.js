import { __extends } from "tslib";
import { Arbitrary } from './definition/Arbitrary.js';
var MemoArbitrary = (function (_super) {
    __extends(MemoArbitrary, _super);
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
}(Arbitrary));
export { MemoArbitrary };
var contextRemainingDepth = 10;
export var memo = function (builder) {
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
