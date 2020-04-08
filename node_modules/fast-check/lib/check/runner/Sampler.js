"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var Stream_1 = require("../../stream/Stream");
var polyfills_1 = require("../../utils/polyfills");
var Property_generic_1 = require("../property/Property.generic");
var UnbiasedProperty_1 = require("../property/UnbiasedProperty");
var GlobalParameters_1 = require("./configuration/GlobalParameters");
var QualifiedParameters_1 = require("./configuration/QualifiedParameters");
var Tosser_1 = require("./Tosser");
var PathWalker_1 = require("./utils/PathWalker");
function toProperty(generator, qParams) {
    var prop = !Object.prototype.hasOwnProperty.call(generator, 'isAsync')
        ? new Property_generic_1.Property(generator, function () { return true; })
        : generator;
    return qParams.unbiased === true ? new UnbiasedProperty_1.UnbiasedProperty(prop) : prop;
}
function streamSample(generator, params) {
    var extendedParams = typeof params === 'number'
        ? tslib_1.__assign(tslib_1.__assign({}, GlobalParameters_1.readConfigureGlobal()), { numRuns: params }) : tslib_1.__assign(tslib_1.__assign({}, GlobalParameters_1.readConfigureGlobal()), params);
    var qParams = QualifiedParameters_1.QualifiedParameters.read(extendedParams);
    var tossedValues = Stream_1.stream(Tosser_1.toss(toProperty(generator, qParams), qParams.seed, qParams.randomType, qParams.examples));
    if (qParams.path.length === 0) {
        return tossedValues.take(qParams.numRuns).map(function (s) { return s().value_; });
    }
    return Stream_1.stream(PathWalker_1.pathWalk(qParams.path, tossedValues.map(function (s) { return s(); })))
        .take(qParams.numRuns)
        .map(function (s) { return s.value_; });
}
function sample(generator, params) {
    return tslib_1.__spread(streamSample(generator, params));
}
exports.sample = sample;
function statistics(generator, classify, params) {
    var e_1, _a, e_2, _b, e_3, _c;
    var extendedParams = typeof params === 'number'
        ? tslib_1.__assign(tslib_1.__assign({}, GlobalParameters_1.readConfigureGlobal()), { numRuns: params }) : tslib_1.__assign(tslib_1.__assign({}, GlobalParameters_1.readConfigureGlobal()), params);
    var qParams = QualifiedParameters_1.QualifiedParameters.read(extendedParams);
    var recorded = {};
    try {
        for (var _d = tslib_1.__values(streamSample(generator, params)), _e = _d.next(); !_e.done; _e = _d.next()) {
            var g = _e.value;
            var out = classify(g);
            var categories = Array.isArray(out) ? out : [out];
            try {
                for (var categories_1 = (e_2 = void 0, tslib_1.__values(categories)), categories_1_1 = categories_1.next(); !categories_1_1.done; categories_1_1 = categories_1.next()) {
                    var c = categories_1_1.value;
                    recorded[c] = (recorded[c] || 0) + 1;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (categories_1_1 && !categories_1_1.done && (_b = categories_1["return"])) _b.call(categories_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_e && !_e.done && (_a = _d["return"])) _a.call(_d);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var data = polyfills_1.ObjectEntries(recorded)
        .sort(function (a, b) { return b[1] - a[1]; })
        .map(function (i) { return [i[0], ((i[1] * 100.0) / qParams.numRuns).toFixed(2) + "%"]; });
    var longestName = data.map(function (i) { return i[0].length; }).reduce(function (p, c) { return Math.max(p, c); }, 0);
    var longestPercent = data.map(function (i) { return i[1].length; }).reduce(function (p, c) { return Math.max(p, c); }, 0);
    try {
        for (var data_1 = tslib_1.__values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
            var item = data_1_1.value;
            qParams.logger(polyfills_1.StringPadEnd(item[0], longestName, '.') + ".." + polyfills_1.StringPadStart(item[1], longestPercent, '.'));
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (data_1_1 && !data_1_1.done && (_c = data_1["return"])) _c.call(data_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
}
exports.statistics = statistics;
