import { __extends } from "tslib";
import { Arbitrary } from './Arbitrary.js';
var BiasedArbitraryWrapper = (function (_super) {
    __extends(BiasedArbitraryWrapper, _super);
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
}(Arbitrary));
export function biasWrapper(freq, arb, biasedArbBuilder) {
    return new BiasedArbitraryWrapper(freq, arb, biasedArbBuilder);
}
