"use strict";
exports.__esModule = true;
var TupleArbitrary_generic_1 = require("./TupleArbitrary.generic");
function tuple() {
    var arbs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arbs[_i] = arguments[_i];
    }
    return new TupleArbitrary_generic_1.GenericTupleArbitrary(arbs);
}
exports.tuple = tuple;
