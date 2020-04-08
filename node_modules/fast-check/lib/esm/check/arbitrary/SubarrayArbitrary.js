import { __extends } from "tslib";
import { Stream } from '../../stream/Stream.js';
import { Arbitrary } from './definition/Arbitrary.js';
import { biasWrapper } from './definition/BiasedArbitraryWrapper.js';
import { Shrinkable } from './definition/Shrinkable.js';
import { integer } from './IntegerArbitrary.js';
import { makeLazy } from '../../stream/LazyIterableIterator.js';
var SubarrayArbitrary = (function (_super) {
    __extends(SubarrayArbitrary, _super);
    function SubarrayArbitrary(originalArray, isOrdered, minLength, maxLength) {
        var _this = _super.call(this) || this;
        _this.originalArray = originalArray;
        _this.isOrdered = isOrdered;
        _this.minLength = minLength;
        _this.maxLength = maxLength;
        if (minLength < 0 || minLength > originalArray.length)
            throw new Error('fc.*{s|S}ubarrayOf expects the minimal length to be between 0 and the size of the original array');
        if (maxLength < 0 || maxLength > originalArray.length)
            throw new Error('fc.*{s|S}ubarrayOf expects the maximal length to be between 0 and the size of the original array');
        if (minLength > maxLength)
            throw new Error('fc.*{s|S}ubarrayOf expects the minimal length to be inferior or equal to the maximal length');
        _this.lengthArb = integer(minLength, maxLength);
        return _this;
    }
    SubarrayArbitrary.prototype.wrapper = function (items, shrunkOnce) {
        var _this = this;
        return new Shrinkable(items, function () { return _this.shrinkImpl(items, shrunkOnce).map(function (v) { return _this.wrapper(v, true); }); });
    };
    SubarrayArbitrary.prototype.generate = function (mrng) {
        var _this = this;
        var remainingElements = this.originalArray.map(function (v, idx) { return idx; });
        var size = this.lengthArb.generate(mrng).value;
        var ids = [];
        for (var idx = 0; idx !== size; ++idx) {
            var selectedIdIndex = mrng.nextInt(0, remainingElements.length - 1);
            ids.push(remainingElements[selectedIdIndex]);
            remainingElements.splice(selectedIdIndex, 1);
        }
        if (this.isOrdered)
            ids.sort(function (a, b) { return a - b; });
        return this.wrapper(ids.map(function (i) { return _this.originalArray[i]; }), false);
    };
    SubarrayArbitrary.prototype.shrinkImpl = function (items, shrunkOnce) {
        var _this = this;
        if (items.length === 0) {
            return Stream.nil();
        }
        var size = this.lengthArb.shrinkableFor(items.length, shrunkOnce);
        return size
            .shrink()
            .map(function (l) { return items.slice(items.length - l.value); })
            .join(items.length > this.minLength
            ? makeLazy(function () {
                return _this.shrinkImpl(items.slice(1), false)
                    .filter(function (vs) { return _this.minLength <= vs.length + 1; })
                    .map(function (vs) { return [items[0]].concat(vs); });
            })
            : Stream.nil());
    };
    SubarrayArbitrary.prototype.withBias = function (freq) {
        return this.minLength !== this.maxLength
            ? biasWrapper(freq, this, function (originalArbitrary) {
                return new SubarrayArbitrary(originalArbitrary.originalArray, originalArbitrary.isOrdered, originalArbitrary.minLength, originalArbitrary.minLength +
                    Math.floor(Math.log(originalArbitrary.maxLength - originalArbitrary.minLength) / Math.log(2)));
            })
            : this;
    };
    return SubarrayArbitrary;
}(Arbitrary));
function subarray(originalArray, minLength, maxLength) {
    if (minLength != null && maxLength != null)
        return new SubarrayArbitrary(originalArray, true, minLength, maxLength);
    return new SubarrayArbitrary(originalArray, true, 0, originalArray.length);
}
function shuffledSubarray(originalArray, minLength, maxLength) {
    if (minLength != null && maxLength != null)
        return new SubarrayArbitrary(originalArray, false, minLength, maxLength);
    return new SubarrayArbitrary(originalArray, false, 0, originalArray.length);
}
export { subarray, shuffledSubarray };
