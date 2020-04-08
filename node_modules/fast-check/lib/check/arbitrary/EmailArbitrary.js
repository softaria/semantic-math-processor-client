"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var ArrayArbitrary_1 = require("./ArrayArbitrary");
var SpecificCharacterRange_1 = require("./helpers/SpecificCharacterRange");
var HostArbitrary_1 = require("./HostArbitrary");
var StringArbitrary_1 = require("./StringArbitrary");
var TupleArbitrary_1 = require("./TupleArbitrary");
function emailAddress() {
    var others = ['!', '#', '$', '%', '&', "'", '*', '+', '-', '/', '=', '?', '^', '_', '`', '{', '|', '}', '~'];
    var atextArb = SpecificCharacterRange_1.buildLowerAlphaNumericArb(others);
    var dotAtomArb = ArrayArbitrary_1.array(StringArbitrary_1.stringOf(atextArb, 1, 10), 1, 5).map(function (a) { return a.join('.'); });
    return TupleArbitrary_1.tuple(dotAtomArb, HostArbitrary_1.domain()).map(function (_a) {
        var _b = tslib_1.__read(_a, 2), lp = _b[0], d = _b[1];
        return lp + "@" + d;
    });
}
exports.emailAddress = emailAddress;
