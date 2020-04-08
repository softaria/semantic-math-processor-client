"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var hash_1 = require("../../utils/hash");
var stringify_1 = require("../../utils/stringify");
var symbols_1 = require("../symbols");
var ArrayArbitrary_1 = require("./ArrayArbitrary");
var IntegerArbitrary_1 = require("./IntegerArbitrary");
var TupleArbitrary_1 = require("./TupleArbitrary");
function func(arb) {
    return TupleArbitrary_1.tuple(ArrayArbitrary_1.array(arb, 1, 10), IntegerArbitrary_1.integer().noShrink()).map(function (_a) {
        var _b = tslib_1.__read(_a, 2), outs = _b[0], seed = _b[1];
        var producer = function () {
            var _a;
            var recorded = {};
            var f = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var repr = stringify_1.stringify(args);
                var val = outs[hash_1.hash("" + seed + repr) % outs.length];
                recorded[repr] = val;
                return symbols_1.hasCloneMethod(val) ? val[symbols_1.cloneMethod]() : val;
            };
            return Object.assign(f, (_a = {
                    toString: function () {
                        return '<function :: ' +
                            Object.keys(recorded)
                                .sort()
                                .map(function (k) { return k + " => " + stringify_1.stringify(recorded[k]); })
                                .join(', ') +
                            '>';
                    }
                },
                _a[symbols_1.cloneMethod] = producer,
                _a));
        };
        return producer();
    });
}
exports.func = func;
function compareFuncImplem(cmp) {
    return TupleArbitrary_1.tuple(IntegerArbitrary_1.integer().noShrink(), IntegerArbitrary_1.integer(1, 0xffffffff).noShrink()).map(function (_a) {
        var _b = tslib_1.__read(_a, 2), seed = _b[0], hashEnvSize = _b[1];
        var producer = function () {
            var _a;
            var recorded = {};
            var f = function (a, b) {
                var reprA = stringify_1.stringify(a);
                var reprB = stringify_1.stringify(b);
                var hA = hash_1.hash("" + seed + reprA) % hashEnvSize;
                var hB = hash_1.hash("" + seed + reprB) % hashEnvSize;
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
                _a[symbols_1.cloneMethod] = producer,
                _a));
        };
        return producer();
    });
}
function compareFunc() {
    return compareFuncImplem(function (hA, hB) { return hA - hB; });
}
exports.compareFunc = compareFunc;
function compareBooleanFunc() {
    return compareFuncImplem(function (hA, hB) { return hA < hB; });
}
exports.compareBooleanFunc = compareBooleanFunc;
