import { __assign, __read, __spread, __values } from "tslib";
import { stream } from '../../stream/Stream.js';
import { ObjectEntries, StringPadEnd, StringPadStart } from '../../utils/polyfills.js';
import { Property } from '../property/Property.generic.js';
import { UnbiasedProperty } from '../property/UnbiasedProperty.js';
import { readConfigureGlobal } from './configuration/GlobalParameters.js';
import { QualifiedParameters } from './configuration/QualifiedParameters.js';
import { toss } from './Tosser.js';
import { pathWalk } from './utils/PathWalker.js';
function toProperty(generator, qParams) {
    var prop = !Object.prototype.hasOwnProperty.call(generator, 'isAsync')
        ? new Property(generator, function () { return true; })
        : generator;
    return qParams.unbiased === true ? new UnbiasedProperty(prop) : prop;
}
function streamSample(generator, params) {
    var extendedParams = typeof params === 'number'
        ? __assign(__assign({}, readConfigureGlobal()), { numRuns: params }) : __assign(__assign({}, readConfigureGlobal()), params);
    var qParams = QualifiedParameters.read(extendedParams);
    var tossedValues = stream(toss(toProperty(generator, qParams), qParams.seed, qParams.randomType, qParams.examples));
    if (qParams.path.length === 0) {
        return tossedValues.take(qParams.numRuns).map(function (s) { return s().value_; });
    }
    return stream(pathWalk(qParams.path, tossedValues.map(function (s) { return s(); })))
        .take(qParams.numRuns)
        .map(function (s) { return s.value_; });
}
function sample(generator, params) {
    return __spread(streamSample(generator, params));
}
function statistics(generator, classify, params) {
    var e_1, _a, e_2, _b, e_3, _c;
    var extendedParams = typeof params === 'number'
        ? __assign(__assign({}, readConfigureGlobal()), { numRuns: params }) : __assign(__assign({}, readConfigureGlobal()), params);
    var qParams = QualifiedParameters.read(extendedParams);
    var recorded = {};
    try {
        for (var _d = __values(streamSample(generator, params)), _e = _d.next(); !_e.done; _e = _d.next()) {
            var g = _e.value;
            var out = classify(g);
            var categories = Array.isArray(out) ? out : [out];
            try {
                for (var categories_1 = (e_2 = void 0, __values(categories)), categories_1_1 = categories_1.next(); !categories_1_1.done; categories_1_1 = categories_1.next()) {
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
    var data = ObjectEntries(recorded)
        .sort(function (a, b) { return b[1] - a[1]; })
        .map(function (i) { return [i[0], ((i[1] * 100.0) / qParams.numRuns).toFixed(2) + "%"]; });
    var longestName = data.map(function (i) { return i[0].length; }).reduce(function (p, c) { return Math.max(p, c); }, 0);
    var longestPercent = data.map(function (i) { return i[1].length; }).reduce(function (p, c) { return Math.max(p, c); }, 0);
    try {
        for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
            var item = data_1_1.value;
            qParams.logger(StringPadEnd(item[0], longestName, '.') + ".." + StringPadStart(item[1], longestPercent, '.'));
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
export { sample, statistics };
