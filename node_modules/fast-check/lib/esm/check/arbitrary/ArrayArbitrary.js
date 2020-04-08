import { __extends } from "tslib";
import { Stream } from '../../stream/Stream.js';
import { cloneMethod } from '../symbols.js';
import { Arbitrary } from './definition/Arbitrary.js';
import { biasWrapper } from './definition/BiasedArbitraryWrapper.js';
import { Shrinkable } from './definition/Shrinkable.js';
import { integer } from './IntegerArbitrary.js';
import { makeLazy } from '../../stream/LazyIterableIterator.js';
var ArrayArbitrary = (function (_super) {
    __extends(ArrayArbitrary, _super);
    function ArrayArbitrary(arb, minLength, maxLength, preFilter) {
        if (preFilter === void 0) { preFilter = function (tab) { return tab; }; }
        var _this = _super.call(this) || this;
        _this.arb = arb;
        _this.minLength = minLength;
        _this.maxLength = maxLength;
        _this.preFilter = preFilter;
        _this.lengthArb = integer(minLength, maxLength);
        return _this;
    }
    ArrayArbitrary.makeItCloneable = function (vs, shrinkables) {
        var _this = this;
        vs[cloneMethod] = function () {
            var cloned = [];
            for (var idx = 0; idx !== shrinkables.length; ++idx) {
                cloned.push(shrinkables[idx].value);
            }
            _this.makeItCloneable(cloned, shrinkables);
            return cloned;
        };
        return vs;
    };
    ArrayArbitrary.prototype.wrapper = function (itemsRaw, shrunkOnce) {
        var _this = this;
        var items = this.preFilter(itemsRaw);
        var cloneable = false;
        var vs = [];
        for (var idx = 0; idx !== items.length; ++idx) {
            var s = items[idx];
            cloneable = cloneable || s.hasToBeCloned;
            vs.push(s.value);
        }
        if (cloneable) {
            ArrayArbitrary.makeItCloneable(vs, items);
        }
        return new Shrinkable(vs, function () { return _this.shrinkImpl(items, shrunkOnce).map(function (v) { return _this.wrapper(v, true); }); });
    };
    ArrayArbitrary.prototype.generate = function (mrng) {
        var size = this.lengthArb.generate(mrng);
        var items = [];
        for (var idx = 0; idx !== size.value; ++idx) {
            items.push(this.arb.generate(mrng));
        }
        return this.wrapper(items, false);
    };
    ArrayArbitrary.prototype.shrinkImpl = function (items, shrunkOnce) {
        var _this = this;
        if (items.length === 0) {
            return Stream.nil();
        }
        var size = this.lengthArb.shrinkableFor(items.length, shrunkOnce);
        return size
            .shrink()
            .map(function (l) { return items.slice(items.length - l.value); })
            .join(items[0].shrink().map(function (v) { return [v].concat(items.slice(1)); }))
            .join(items.length > this.minLength
            ? makeLazy(function () {
                return _this.shrinkImpl(items.slice(1), false)
                    .filter(function (vs) { return _this.minLength <= vs.length + 1; })
                    .map(function (vs) { return [items[0]].concat(vs); });
            })
            : Stream.nil());
    };
    ArrayArbitrary.prototype.withBias = function (freq) {
        return biasWrapper(freq, this, function (originalArbitrary) {
            var lowBiased = new ArrayArbitrary(originalArbitrary.arb.withBias(freq), originalArbitrary.minLength, originalArbitrary.maxLength, originalArbitrary.preFilter);
            var highBiasedArbBuilder = function () {
                return originalArbitrary.minLength !== originalArbitrary.maxLength
                    ? new ArrayArbitrary(originalArbitrary.arb.withBias(freq), originalArbitrary.minLength, originalArbitrary.minLength +
                        Math.floor(Math.log(originalArbitrary.maxLength - originalArbitrary.minLength) / Math.log(2)), originalArbitrary.preFilter)
                    : new ArrayArbitrary(originalArbitrary.arb.withBias(freq), originalArbitrary.minLength, originalArbitrary.maxLength, originalArbitrary.preFilter);
            };
            return biasWrapper(freq, lowBiased, highBiasedArbBuilder);
        });
    };
    return ArrayArbitrary;
}(Arbitrary));
function array(arb, aLength, bLength) {
    if (bLength == null)
        return new ArrayArbitrary(arb, 0, aLength == null ? 10 : aLength);
    return new ArrayArbitrary(arb, aLength || 0, bLength);
}
export { array, ArrayArbitrary };
