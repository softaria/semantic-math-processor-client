import { __extends, __generator, __read, __spread } from "tslib";
import { Stream } from '../../stream/Stream.js';
import { stringify } from '../../utils/stringify.js';
import { cloneMethod } from '../symbols.js';
import { Arbitrary } from './definition/Arbitrary.js';
import { biasWrapper } from './definition/BiasedArbitraryWrapper.js';
import { Shrinkable } from './definition/Shrinkable.js';
var StreamArbitrary = (function (_super) {
    __extends(StreamArbitrary, _super);
    function StreamArbitrary(arb) {
        var _this = _super.call(this) || this;
        _this.arb = arb;
        return _this;
    }
    StreamArbitrary.prototype.generate = function (mrng) {
        var _this = this;
        var g = function (arb, clonedMrng) {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!true) return [3, 2];
                        return [4, arb.generate(clonedMrng).value_];
                    case 1:
                        _a.sent();
                        return [3, 0];
                    case 2: return [2];
                }
            });
        };
        var producer = function () { return new Stream(g(_this.arb, mrng.clone())); };
        var toString = function () {
            return "Stream(" + __spread(producer()
                .take(10)
                .map(stringify)).join(',') + "...)";
        };
        var enrichedProducer = function () {
            var _a;
            return Object.assign(producer(), (_a = { toString: toString }, _a[cloneMethod] = enrichedProducer, _a));
        };
        return new Shrinkable(enrichedProducer());
    };
    StreamArbitrary.prototype.withBias = function (freq) {
        var _this = this;
        return biasWrapper(freq, this, function () { return new StreamArbitrary(_this.arb.withBias(freq)); });
    };
    return StreamArbitrary;
}(Arbitrary));
function infiniteStream(arb) {
    return new StreamArbitrary(arb);
}
export { infiniteStream };
