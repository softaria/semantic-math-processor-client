"use strict";
exports.__esModule = true;
var IntegerArbitrary_1 = require("./IntegerArbitrary");
function computeNumChoices(options) {
    if (options.length === 0)
        throw new Error("fc.mapToConstant expects at least one option");
    var numChoices = 0;
    for (var idx = 0; idx !== options.length; ++idx) {
        if (options[idx].num < 0)
            throw new Error("fc.mapToConstant expects all options to have a number of entries greater or equal to zero");
        numChoices += options[idx].num;
    }
    if (numChoices === 0)
        throw new Error("fc.mapToConstant expects at least one choice among options");
    return numChoices;
}
function mapToConstant() {
    var entries = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        entries[_i] = arguments[_i];
    }
    var numChoices = computeNumChoices(entries);
    return IntegerArbitrary_1.nat(numChoices - 1).map(function (choice) {
        var idx = -1;
        var numSkips = 0;
        while (choice >= numSkips) {
            numSkips += entries[++idx].num;
        }
        return entries[idx].build(choice - numSkips + entries[idx].num);
    });
}
exports.mapToConstant = mapToConstant;
