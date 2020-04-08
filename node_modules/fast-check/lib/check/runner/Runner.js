"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var Stream_1 = require("../../stream/Stream");
var Shrinkable_1 = require("../arbitrary/definition/Shrinkable");
var GlobalParameters_1 = require("./configuration/GlobalParameters");
var QualifiedParameters_1 = require("./configuration/QualifiedParameters");
var DecorateProperty_1 = require("./DecorateProperty");
var RunnerIterator_1 = require("./RunnerIterator");
var SourceValuesIterator_1 = require("./SourceValuesIterator");
var Tosser_1 = require("./Tosser");
var PathWalker_1 = require("./utils/PathWalker");
var RunDetailsFormatter_1 = require("./utils/RunDetailsFormatter");
function runIt(property, sourceValues, verbose, interruptedAsFailure) {
    var e_1, _a;
    var runner = new RunnerIterator_1.RunnerIterator(sourceValues, verbose, interruptedAsFailure);
    try {
        for (var runner_1 = tslib_1.__values(runner), runner_1_1 = runner_1.next(); !runner_1_1.done; runner_1_1 = runner_1.next()) {
            var v = runner_1_1.value;
            var out = property.run(v);
            runner.handleResult(out);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (runner_1_1 && !runner_1_1.done && (_a = runner_1["return"])) _a.call(runner_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return runner.runExecution;
}
function asyncRunIt(property, sourceValues, verbose, interruptedAsFailure) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var runner, runner_2, runner_2_1, v, out, e_2_1;
        var e_2, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    runner = new RunnerIterator_1.RunnerIterator(sourceValues, verbose, interruptedAsFailure);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    runner_2 = tslib_1.__values(runner), runner_2_1 = runner_2.next();
                    _b.label = 2;
                case 2:
                    if (!!runner_2_1.done) return [3, 5];
                    v = runner_2_1.value;
                    return [4, property.run(v)];
                case 3:
                    out = _b.sent();
                    runner.handleResult(out);
                    _b.label = 4;
                case 4:
                    runner_2_1 = runner_2.next();
                    return [3, 2];
                case 5: return [3, 8];
                case 6:
                    e_2_1 = _b.sent();
                    e_2 = { error: e_2_1 };
                    return [3, 8];
                case 7:
                    try {
                        if (runner_2_1 && !runner_2_1.done && (_a = runner_2["return"])) _a.call(runner_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7];
                case 8: return [2, runner.runExecution];
            }
        });
    });
}
function runnerPathWalker(valueProducers, path) {
    var pathPoints = path.split(':');
    var pathStream = Stream_1.stream(valueProducers)
        .drop(pathPoints.length > 0 ? +pathPoints[0] : 0)
        .map(function (producer) { return producer(); });
    var adaptedPath = tslib_1.__spread(['0'], pathPoints.slice(1)).join(':');
    return Stream_1.stream(PathWalker_1.pathWalk(adaptedPath, pathStream)).map(function (v) { return function () { return v; }; });
}
function buildInitialValues(valueProducers, qParams) {
    var rawValues = qParams.path.length === 0 ? Stream_1.stream(valueProducers) : runnerPathWalker(valueProducers, qParams.path);
    if (!qParams.endOnFailure)
        return rawValues;
    return rawValues.map(function (shrinkableGen) {
        return function () {
            var s = shrinkableGen();
            return new Shrinkable_1.Shrinkable(s.value_);
        };
    });
}
function check(rawProperty, params) {
    if (rawProperty == null || rawProperty.generate == null)
        throw new Error('Invalid property encountered, please use a valid property');
    if (rawProperty.run == null)
        throw new Error('Invalid property encountered, please use a valid property not an arbitrary');
    var qParams = QualifiedParameters_1.QualifiedParameters.read(tslib_1.__assign(tslib_1.__assign({}, GlobalParameters_1.readConfigureGlobal()), params));
    var property = DecorateProperty_1.decorateProperty(rawProperty, qParams);
    var generator = Tosser_1.toss(property, qParams.seed, qParams.randomType, qParams.examples);
    var maxInitialIterations = qParams.path.indexOf(':') === -1 ? qParams.numRuns : -1;
    var maxSkips = qParams.numRuns * qParams.maxSkipsPerRun;
    var initialValues = buildInitialValues(generator, qParams);
    var sourceValues = new SourceValuesIterator_1.SourceValuesIterator(initialValues, maxInitialIterations, maxSkips);
    return property.isAsync()
        ? asyncRunIt(property, sourceValues, qParams.verbose, qParams.markInterruptAsFailure).then(function (e) {
            return e.toRunDetails(qParams.seed, qParams.path, qParams.numRuns, maxSkips);
        })
        : runIt(property, sourceValues, qParams.verbose, qParams.markInterruptAsFailure).toRunDetails(qParams.seed, qParams.path, qParams.numRuns, maxSkips);
}
exports.check = check;
function assert(property, params) {
    var out = check(property, params);
    if (property.isAsync())
        return out.then(RunDetailsFormatter_1.throwIfFailed);
    else
        RunDetailsFormatter_1.throwIfFailed(out);
}
exports.assert = assert;
