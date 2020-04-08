"use strict";
exports.__esModule = true;
var polyfills_1 = require("../../utils/polyfills");
var IntegerArbitrary_1 = require("./IntegerArbitrary");
var TupleArbitrary_1 = require("./TupleArbitrary");
var padEight = function (arb) { return arb.map(function (n) { return polyfills_1.StringPadStart(n.toString(16), 8, '0'); }); };
function uuid() {
    var padded = padEight(IntegerArbitrary_1.nat(0xffffffff));
    var secondPadded = padEight(IntegerArbitrary_1.integer(0x10000000, 0x5fffffff));
    var thirdPadded = padEight(IntegerArbitrary_1.integer(0x80000000, 0xbfffffff));
    return TupleArbitrary_1.tuple(padded, secondPadded, thirdPadded, padded).map(function (t) {
        return t[0] + "-" + t[1].substring(4) + "-" + t[1].substring(0, 4) + "-" + t[2].substring(0, 4) + "-" + t[2].substring(4) + t[3];
    });
}
exports.uuid = uuid;
function uuidV(versionNumber) {
    var padded = padEight(IntegerArbitrary_1.nat(0xffffffff));
    var secondPadded = padEight(IntegerArbitrary_1.nat(0x0fffffff));
    var thirdPadded = padEight(IntegerArbitrary_1.integer(0x80000000, 0xbfffffff));
    return TupleArbitrary_1.tuple(padded, secondPadded, thirdPadded, padded).map(function (t) {
        return t[0] + "-" + t[1].substring(4) + "-" + versionNumber + t[1].substring(1, 4) + "-" + t[2].substring(0, 4) + "-" + t[2].substring(4) + t[3];
    });
}
exports.uuidV = uuidV;
