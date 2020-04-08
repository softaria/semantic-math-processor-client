import { __extends } from "tslib";
import { Shrinkable } from './Shrinkable.js';
var Arbitrary = (function () {
    function Arbitrary() {
    }
    Arbitrary.prototype.filter = function (refinement) {
        var arb = this;
        var refinementOnShrinkable = function (s) {
            return refinement(s.value);
        };
        return new ((function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_1.prototype.generate = function (mrng) {
                var g = arb.generate(mrng);
                while (!refinementOnShrinkable(g)) {
                    g = arb.generate(mrng);
                }
                return g.filter(refinement);
            };
            class_1.prototype.withBias = function (freq) {
                return arb.withBias(freq).filter(refinement);
            };
            return class_1;
        }(Arbitrary)))();
    };
    Arbitrary.prototype.map = function (mapper) {
        var arb = this;
        return new ((function (_super) {
            __extends(class_2, _super);
            function class_2() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_2.prototype.generate = function (mrng) {
                return arb.generate(mrng).map(mapper);
            };
            class_2.prototype.withBias = function (freq) {
                return arb.withBias(freq).map(mapper);
            };
            return class_2;
        }(Arbitrary)))();
    };
    Arbitrary.shrinkChain = function (mrng, src, dst, fmapper) {
        return new Shrinkable(dst.value, function () {
            return src
                .shrink()
                .map(function (v) {
                return Arbitrary.shrinkChain(mrng.clone(), v, fmapper(v.value).generate(mrng.clone()), fmapper);
            })
                .join(dst.shrink());
        });
    };
    Arbitrary.prototype.chain = function (fmapper) {
        var arb = this;
        return new ((function (_super) {
            __extends(class_3, _super);
            function class_3() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_3.prototype.generate = function (mrng) {
                var clonedMrng = mrng.clone();
                var src = arb.generate(mrng);
                var dst = fmapper(src.value).generate(mrng);
                return Arbitrary.shrinkChain(clonedMrng, src, dst, fmapper);
            };
            class_3.prototype.withBias = function (freq) {
                return arb.withBias(freq).chain(function (t) { return fmapper(t).withBias(freq); });
            };
            return class_3;
        }(Arbitrary)))();
    };
    Arbitrary.prototype.noShrink = function () {
        var arb = this;
        return new ((function (_super) {
            __extends(class_4, _super);
            function class_4() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_4.prototype.generate = function (mrng) {
                return new Shrinkable(arb.generate(mrng).value);
            };
            class_4.prototype.withBias = function (freq) {
                return arb.withBias(freq).noShrink();
            };
            return class_4;
        }(Arbitrary)))();
    };
    Arbitrary.prototype.withBias = function (_freq) {
        return this;
    };
    Arbitrary.prototype.noBias = function () {
        var arb = this;
        return new ((function (_super) {
            __extends(class_5, _super);
            function class_5() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_5.prototype.generate = function (mrng) {
                return arb.generate(mrng);
            };
            return class_5;
        }(Arbitrary)))();
    };
    return Arbitrary;
}());
export { Arbitrary };
