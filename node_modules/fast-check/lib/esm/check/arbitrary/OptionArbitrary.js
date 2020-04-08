import { __extends, __generator } from "tslib";
import { Arbitrary } from './definition/Arbitrary.js';
import { Shrinkable } from './definition/Shrinkable.js';
import { nat } from './IntegerArbitrary.js';
var OptionArbitrary = (function (_super) {
    __extends(OptionArbitrary, _super);
    function OptionArbitrary(arb, frequency, nil) {
        var _this = _super.call(this) || this;
        _this.arb = arb;
        _this.frequency = frequency;
        _this.nil = nil;
        _this.isOptionArb = nat(frequency);
        return _this;
    }
    OptionArbitrary.extendedShrinkable = function (s, nil) {
        function g() {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, new Shrinkable(nil)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        }
        return new Shrinkable(s.value_, function () {
            return s
                .shrink()
                .map(function (v) { return OptionArbitrary.extendedShrinkable(v, nil); })
                .join(g());
        });
    };
    OptionArbitrary.prototype.generate = function (mrng) {
        return this.isOptionArb.generate(mrng).value === 0
            ? new Shrinkable(this.nil)
            : OptionArbitrary.extendedShrinkable(this.arb.generate(mrng), this.nil);
    };
    OptionArbitrary.prototype.withBias = function (freq) {
        return new OptionArbitrary(this.arb.withBias(freq), this.frequency, this.nil);
    };
    return OptionArbitrary;
}(Arbitrary));
function option(arb, constraints) {
    if (!constraints)
        return new OptionArbitrary(arb, 5, null);
    if (typeof constraints === 'number')
        return new OptionArbitrary(arb, constraints, null);
    return new OptionArbitrary(arb, constraints.freq == null ? 5 : constraints.freq, Object.prototype.hasOwnProperty.call(constraints, 'nil') ? constraints.nil : null);
}
export { option };
