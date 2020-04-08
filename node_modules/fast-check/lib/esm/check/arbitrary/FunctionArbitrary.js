import { __read } from "tslib";
import { hash } from '../../utils/hash.js';
import { stringify } from '../../utils/stringify.js';
import { cloneMethod, hasCloneMethod } from '../symbols.js';
import { array } from './ArrayArbitrary.js';
import { integer } from './IntegerArbitrary.js';
import { tuple } from './TupleArbitrary.js';
export function func(arb) {
    return tuple(array(arb, 1, 10), integer().noShrink()).map(function (_a) {
        var _b = __read(_a, 2), outs = _b[0], seed = _b[1];
        var producer = function () {
            var _a;
            var recorded = {};
            var f = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var repr = stringify(args);
                var val = outs[hash("" + seed + repr) % outs.length];
                recorded[repr] = val;
                return hasCloneMethod(val) ? val[cloneMethod]() : val;
            };
            return Object.assign(f, (_a = {
                    toString: function () {
                        return '<function :: ' +
                            Object.keys(recorded)
                                .sort()
                                .map(function (k) { return k + " => " + stringify(recorded[k]); })
                                .join(', ') +
                            '>';
                    }
                },
                _a[cloneMethod] = producer,
                _a));
        };
        return producer();
    });
}
function compareFuncImplem(cmp) {
    return tuple(integer().noShrink(), integer(1, 0xffffffff).noShrink()).map(function (_a) {
        var _b = __read(_a, 2), seed = _b[0], hashEnvSize = _b[1];
        var producer = function () {
            var _a;
            var recorded = {};
            var f = function (a, b) {
                var reprA = stringify(a);
                var reprB = stringify(b);
                var hA = hash("" + seed + reprA) % hashEnvSize;
                var hB = hash("" + seed + reprB) % hashEnvSize;
                var val = cmp(hA, hB);
                recorded["[" + reprA + "," + reprB + "]"] = val;
                return val;
            };
            return Object.assign(f, (_a = {
                    toString: function () {
                        return '<function :: ' +
                            Object.keys(recorded)
                                .sort()
                                .map(function (k) { return k + " => " + recorded[k]; })
                                .join(', ') +
                            '>';
                    }
                },
                _a[cloneMethod] = producer,
                _a));
        };
        return producer();
    });
}
export function compareFunc() {
    return compareFuncImplem(function (hA, hB) { return hA - hB; });
}
export function compareBooleanFunc() {
    return compareFuncImplem(function (hA, hB) { return hA < hB; });
}
