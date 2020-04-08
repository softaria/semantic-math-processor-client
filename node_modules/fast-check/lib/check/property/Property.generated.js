"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var TupleArbitrary_1 = require("../arbitrary/TupleArbitrary");
var Property_generic_1 = require("./Property.generic");
function property() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length < 2)
        throw new Error('property expects at least two parameters');
    var arbs = args.slice(0, args.length - 1);
    var p = args[args.length - 1];
    return new Property_generic_1.Property(TupleArbitrary_1.genericTuple(arbs), function (t) { return p.apply(void 0, tslib_1.__spread(t)); });
}
exports.property = property;
