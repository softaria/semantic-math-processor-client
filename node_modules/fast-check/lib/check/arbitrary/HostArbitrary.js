"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var ArrayArbitrary_1 = require("./ArrayArbitrary");
var SpecificCharacterRange_1 = require("./helpers/SpecificCharacterRange");
var OptionArbitrary_1 = require("./OptionArbitrary");
var StringArbitrary_1 = require("./StringArbitrary");
var TupleArbitrary_1 = require("./TupleArbitrary");
function subdomain() {
    var alphaNumericArb = SpecificCharacterRange_1.buildLowerAlphaNumericArb([]);
    var alphaNumericHyphenArb = SpecificCharacterRange_1.buildLowerAlphaNumericArb(['-']);
    return TupleArbitrary_1.tuple(alphaNumericArb, OptionArbitrary_1.option(TupleArbitrary_1.tuple(StringArbitrary_1.stringOf(alphaNumericHyphenArb), alphaNumericArb)))
        .map(function (_a) {
        var _b = tslib_1.__read(_a, 2), f = _b[0], d = _b[1];
        return (d === null ? f : "" + f + d[0] + d[1]);
    })
        .filter(function (d) { return d.length <= 63; })
        .filter(function (d) {
        return d.length < 4 || d[0] !== 'x' || d[1] !== 'n' || d[2] !== '-' || d[3] !== '-';
    });
}
function domain() {
    var alphaNumericArb = SpecificCharacterRange_1.buildLowerAlphaArb([]);
    var extensionArb = StringArbitrary_1.stringOf(alphaNumericArb, 2, 10);
    return TupleArbitrary_1.tuple(ArrayArbitrary_1.array(subdomain(), 1, 5), extensionArb)
        .map(function (_a) {
        var _b = tslib_1.__read(_a, 2), mid = _b[0], ext = _b[1];
        return mid.join('.') + "." + ext;
    })
        .filter(function (d) { return d.length <= 255; });
}
exports.domain = domain;
function hostUserInfo() {
    var others = ['-', '.', '_', '~', '!', '$', '&', "'", '(', ')', '*', '+', ',', ';', '=', ':'];
    return StringArbitrary_1.stringOf(SpecificCharacterRange_1.buildAlphaNumericPercentArb(others));
}
exports.hostUserInfo = hostUserInfo;
