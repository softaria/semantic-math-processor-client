"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var Arbitrary_1 = require("./definition/Arbitrary");
var Shrinkable_1 = require("./definition/Shrinkable");
var IntegerArbitrary_1 = require("./IntegerArbitrary");
var OptionArbitrary = (function (_super) {
    tslib_1.__extends(OptionArbitrary, _super);
    function OptionArbitrary(arb, frequency, nil) {
        var _this = _super.call(this) || this;
        _this.arb = arb;
        _this.frequency = frequency;
        _this.nil = nil;
        _this.isOptionArb = IntegerArbitrary_1.nat(frequency);
        return _this;
    }
    OptionArbitrary.extendedShrinkable = function (s, nil) {
        function g() {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, new Shrinkable_1.Shrinkable(nil)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        }
        return new Shrinkable_1.Shrinkable(s.value_, function () {
            return s
                .shrink()
                .map(function (v) { return OptionArbitrary.extendedShrinkable(v, nil); })
                .join(g());
        });
    };
    OptionArbitrary.prototype.generate = function (mrng) {
        return this.isOptionArb.generate(mrng).value === 0
            ? new Shrinkable_1.Shrinkable(this.nil)
            : OptionArbitrary.extendedShrinkable(this.arb.generate(mrng), this.nil);
    };
    OptionArbitrary.prototype.withBias = function (freq) {
        return new OptionArbitrary(this.arb.withBias(freq), this.frequency, this.nil);
    };
    return OptionArbitrary;
}(Arbitrary_1.Arbitrary));
function option(arb, constraints) {
    if (!constraints)
        return new OptionArbitrary(arb, 5, null);
    if (typeof constraints === 'number')
        return new OptionArbitrary(arb, constraints, null);
    return new OptionArbitrary(arb, constraints.freq == null ? 5 : constraints.freq, Object.prototype.hasOwnProperty.call(constraints, 'nil') ? constraints.nil : null);
}
exports.option = option;
