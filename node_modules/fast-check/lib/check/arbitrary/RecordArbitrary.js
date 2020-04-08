"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var OptionArbitrary_1 = require("./OptionArbitrary");
var TupleArbitrary_1 = require("./TupleArbitrary");
function rawRecord(recordModel) {
    var keys = Object.keys(recordModel);
    var arbs = keys.map(function (v) { return recordModel[v]; });
    return TupleArbitrary_1.genericTuple(arbs).map(function (gs) {
        var obj = {};
        for (var idx = 0; idx !== keys.length; ++idx)
            obj[keys[idx]] = gs[idx];
        return obj;
    });
}
function record(recordModel, constraints) {
    var e_1, _a;
    if (constraints == null || (constraints.withDeletedKeys !== true && constraints.with_deleted_keys !== true))
        return rawRecord(recordModel);
    var updatedRecordModel = {};
    try {
        for (var _b = tslib_1.__values(Object.keys(recordModel)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var k = _c.value;
            updatedRecordModel[k] = OptionArbitrary_1.option(recordModel[k].map(function (v) { return ({ value: v }); }));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return rawRecord(updatedRecordModel).map(function (obj) {
        var e_2, _a;
        var nobj = {};
        try {
            for (var _b = tslib_1.__values(Object.keys(obj)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var k = _c.value;
                if (obj[k] != null)
                    nobj[k] = obj[k].value;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return nobj;
    });
}
exports.record = record;
