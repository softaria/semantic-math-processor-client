import { __extends, __read, __spread } from "tslib";
import { bigUintN } from './BigIntArbitrary.js';
import { Arbitrary } from './definition/Arbitrary.js';
import { Shrinkable } from './definition/Shrinkable.js';
export function countToggledBits(n) {
    var count = 0;
    while (n > BigInt(0)) {
        if (n & BigInt(1))
            ++count;
        n >>= BigInt(1);
    }
    return count;
}
export function computeNextFlags(flags, nextSize) {
    var allowedMask = (BigInt(1) << BigInt(nextSize)) - BigInt(1);
    var preservedFlags = flags & allowedMask;
    var numMissingFlags = countToggledBits(flags - preservedFlags);
    var nFlags = preservedFlags;
    for (var mask = BigInt(1); mask <= allowedMask && numMissingFlags !== 0; mask <<= BigInt(1)) {
        if (!(nFlags & mask)) {
            nFlags |= mask;
            --numMissingFlags;
        }
    }
    return nFlags;
}
var MixedCaseArbitrary = (function (_super) {
    __extends(MixedCaseArbitrary, _super);
    function MixedCaseArbitrary(stringArb, toggleCase) {
        var _this = _super.call(this) || this;
        _this.stringArb = stringArb;
        _this.toggleCase = toggleCase;
        return _this;
    }
    MixedCaseArbitrary.prototype.computeTogglePositions = function (chars) {
        var positions = [];
        for (var idx = 0; idx !== chars.length; ++idx) {
            if (this.toggleCase(chars[idx]) !== chars[idx])
                positions.push(idx);
        }
        return positions;
    };
    MixedCaseArbitrary.prototype.wrapper = function (rawCase, chars, togglePositions, flags) {
        var _this = this;
        var newChars = chars.slice();
        for (var idx = 0, mask = BigInt(1); idx !== togglePositions.length; ++idx, mask <<= BigInt(1)) {
            if (flags & mask)
                newChars[togglePositions[idx]] = this.toggleCase(newChars[togglePositions[idx]]);
        }
        return new Shrinkable(newChars.join(''), function () { return _this.shrinkImpl(rawCase, chars, togglePositions, flags); });
    };
    MixedCaseArbitrary.prototype.shrinkImpl = function (rawCase, chars, togglePositions, flags) {
        var _this = this;
        return rawCase
            .shrink()
            .map(function (s) {
            var nChars = __spread(s.value_);
            var nTogglePositions = _this.computeTogglePositions(nChars);
            var nFlags = computeNextFlags(flags, nTogglePositions.length);
            return _this.wrapper(s, nChars, nTogglePositions, nFlags);
        })
            .join(bigUintN(togglePositions.length)
            .shrinkableFor(flags)
            .shrink()
            .map(function (nFlags) {
            return _this.wrapper(new Shrinkable(rawCase.value), chars, togglePositions, nFlags.value_);
        }));
    };
    MixedCaseArbitrary.prototype.generate = function (mrng) {
        var rawCaseShrinkable = this.stringArb.generate(mrng);
        var chars = __spread(rawCaseShrinkable.value_);
        var togglePositions = this.computeTogglePositions(chars);
        var flagsArb = bigUintN(togglePositions.length);
        var flags = flagsArb.generate(mrng).value_;
        return this.wrapper(rawCaseShrinkable, chars, togglePositions, flags);
    };
    return MixedCaseArbitrary;
}(Arbitrary));
function defaultToggleCase(rawChar) {
    var upper = rawChar.toUpperCase();
    if (upper !== rawChar)
        return upper;
    return rawChar.toLowerCase();
}
export function mixedCase(stringArb, constraints) {
    if (typeof BigInt === 'undefined') {
        throw new Error("mixedCase requires BigInt support");
    }
    var toggleCase = (constraints && constraints.toggleCase) || defaultToggleCase;
    return new MixedCaseArbitrary(stringArb, toggleCase);
}
