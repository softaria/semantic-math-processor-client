"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var SetArbitrary_1 = require("./SetArbitrary");
var TupleArbitrary_1 = require("./TupleArbitrary");
function toObject(items) {
    var e_1, _a;
    var obj = {};
    try {
        for (var items_1 = tslib_1.__values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
            var keyValue = items_1_1.value;
            obj[keyValue[0]] = keyValue[1];
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (items_1_1 && !items_1_1.done && (_a = items_1["return"])) _a.call(items_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return obj;
}
exports.toObject = toObject;
function dictionary(keyArb, valueArb) {
    return SetArbitrary_1.set(TupleArbitrary_1.tuple(keyArb, valueArb), function (t1, t2) { return t1[0] === t2[0]; }).map(toObject);
}
exports.dictionary = dictionary;
