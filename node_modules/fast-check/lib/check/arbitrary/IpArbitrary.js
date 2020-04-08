"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var ArrayArbitrary_1 = require("./ArrayArbitrary");
var ConstantArbitrary_1 = require("./ConstantArbitrary");
var IntegerArbitrary_1 = require("./IntegerArbitrary");
var OneOfArbitrary_1 = require("./OneOfArbitrary");
var StringArbitrary_1 = require("./StringArbitrary");
var TupleArbitrary_1 = require("./TupleArbitrary");
function ipV4() {
    return TupleArbitrary_1.tuple(IntegerArbitrary_1.nat(255), IntegerArbitrary_1.nat(255), IntegerArbitrary_1.nat(255), IntegerArbitrary_1.nat(255)).map(function (_a) {
        var _b = tslib_1.__read(_a, 4), a = _b[0], b = _b[1], c = _b[2], d = _b[3];
        return a + "." + b + "." + c + "." + d;
    });
}
exports.ipV4 = ipV4;
function ipV4Extended() {
    var natRepr = function (maxValue) {
        return TupleArbitrary_1.tuple(ConstantArbitrary_1.constantFrom('dec', 'oct', 'hex'), IntegerArbitrary_1.nat(maxValue)).map(function (_a) {
            var _b = tslib_1.__read(_a, 2), style = _b[0], v = _b[1];
            switch (style) {
                case 'oct':
                    return "0" + Number(v).toString(8);
                case 'hex':
                    return "0x" + Number(v).toString(16);
                case 'dec':
                default:
                    return "" + v;
            }
        });
    };
    return OneOfArbitrary_1.oneof(TupleArbitrary_1.tuple(natRepr(255), natRepr(255), natRepr(255), natRepr(255)).map(function (_a) {
        var _b = tslib_1.__read(_a, 4), a = _b[0], b = _b[1], c = _b[2], d = _b[3];
        return a + "." + b + "." + c + "." + d;
    }), TupleArbitrary_1.tuple(natRepr(255), natRepr(255), natRepr(65535)).map(function (_a) {
        var _b = tslib_1.__read(_a, 3), a = _b[0], b = _b[1], c = _b[2];
        return a + "." + b + "." + c;
    }), TupleArbitrary_1.tuple(natRepr(255), natRepr(16777215)).map(function (_a) {
        var _b = tslib_1.__read(_a, 2), a = _b[0], b = _b[1];
        return a + "." + b;
    }), natRepr(4294967295));
}
exports.ipV4Extended = ipV4Extended;
function ipV6() {
    var h16Arb = StringArbitrary_1.hexaString(1, 4);
    var ls32Arb = OneOfArbitrary_1.oneof(TupleArbitrary_1.tuple(h16Arb, h16Arb).map(function (_a) {
        var _b = tslib_1.__read(_a, 2), a = _b[0], b = _b[1];
        return a + ":" + b;
    }), ipV4());
    return OneOfArbitrary_1.oneof(TupleArbitrary_1.tuple(ArrayArbitrary_1.array(h16Arb, 6, 6), ls32Arb).map(function (_a) {
        var _b = tslib_1.__read(_a, 2), eh = _b[0], l = _b[1];
        return eh.join(':') + ":" + l;
    }), TupleArbitrary_1.tuple(ArrayArbitrary_1.array(h16Arb, 5, 5), ls32Arb).map(function (_a) {
        var _b = tslib_1.__read(_a, 2), eh = _b[0], l = _b[1];
        return "::" + eh.join(':') + ":" + l;
    }), TupleArbitrary_1.tuple(ArrayArbitrary_1.array(h16Arb, 0, 1), ArrayArbitrary_1.array(h16Arb, 4, 4), ls32Arb).map(function (_a) {
        var _b = tslib_1.__read(_a, 3), bh = _b[0], eh = _b[1], l = _b[2];
        return bh.join(':') + "::" + eh.join(':') + ":" + l;
    }), TupleArbitrary_1.tuple(ArrayArbitrary_1.array(h16Arb, 0, 2), ArrayArbitrary_1.array(h16Arb, 3, 3), ls32Arb).map(function (_a) {
        var _b = tslib_1.__read(_a, 3), bh = _b[0], eh = _b[1], l = _b[2];
        return bh.join(':') + "::" + eh.join(':') + ":" + l;
    }), TupleArbitrary_1.tuple(ArrayArbitrary_1.array(h16Arb, 0, 3), ArrayArbitrary_1.array(h16Arb, 2, 2), ls32Arb).map(function (_a) {
        var _b = tslib_1.__read(_a, 3), bh = _b[0], eh = _b[1], l = _b[2];
        return bh.join(':') + "::" + eh.join(':') + ":" + l;
    }), TupleArbitrary_1.tuple(ArrayArbitrary_1.array(h16Arb, 0, 4), h16Arb, ls32Arb).map(function (_a) {
        var _b = tslib_1.__read(_a, 3), bh = _b[0], eh = _b[1], l = _b[2];
        return bh.join(':') + "::" + eh + ":" + l;
    }), TupleArbitrary_1.tuple(ArrayArbitrary_1.array(h16Arb, 0, 5), ls32Arb).map(function (_a) {
        var _b = tslib_1.__read(_a, 2), bh = _b[0], l = _b[1];
        return bh.join(':') + "::" + l;
    }), TupleArbitrary_1.tuple(ArrayArbitrary_1.array(h16Arb, 0, 6), h16Arb).map(function (_a) {
        var _b = tslib_1.__read(_a, 2), bh = _b[0], eh = _b[1];
        return bh.join(':') + "::" + eh;
    }), TupleArbitrary_1.tuple(ArrayArbitrary_1.array(h16Arb, 0, 7)).map(function (_a) {
        var _b = tslib_1.__read(_a, 1), bh = _b[0];
        return bh.join(':') + "::";
    }));
}
exports.ipV6 = ipV6;
