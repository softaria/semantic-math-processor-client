"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var Arbitrary_1 = require("./Arbitrary");
var BiasedArbitraryWrapper = (function (_super) {
    tslib_1.__extends(BiasedArbitraryWrapper, _super);
    function BiasedArbitraryWrapper(freq, arb, biasedArbBuilder) {
        var _this = _super.call(this) || this;
        _this.freq = freq;
        _this.arb = arb;
        _this.biasedArbBuilder = biasedArbBuilder;
        return _this;
    }
    BiasedArbitraryWrapper.prototype.generate = function (mrng) {
        return mrng.nextInt(1, this.freq) === 1 ? this.biasedArbBuilder(this.arb).generate(mrng) : this.arb.generate(mrng);
    };
    return BiasedArbitraryWrapper;
}(Arbitrary_1.Arbitrary));
function biasWrapper(freq, arb, biasedArbBuilder) {
    return new BiasedArbitraryWrapper(freq, arb, biasedArbBuilder);
}
exports.biasWrapper = biasWrapper;
