import { __assign, __awaiter, __generator, __read, __spread, __values } from "tslib";
import { stream } from '../../stream/Stream.js';
import { Shrinkable } from '../arbitrary/definition/Shrinkable.js';
import { readConfigureGlobal } from './configuration/GlobalParameters.js';
import { QualifiedParameters } from './configuration/QualifiedParameters.js';
import { decorateProperty } from './DecorateProperty.js';
import { RunnerIterator } from './RunnerIterator.js';
import { SourceValuesIterator } from './SourceValuesIterator.js';
import { toss } from './Tosser.js';
import { pathWalk } from './utils/PathWalker.js';
import { throwIfFailed } from './utils/RunDetailsFormatter.js';
function runIt(property, sourceValues, verbose, interruptedAsFailure) {
    var e_1, _a;
    var runner = new RunnerIterator(sourceValues, verbose, interruptedAsFailure);
    try {
        for (var runner_1 = __values(runner), runner_1_1 = runner_1.next(); !runner_1_1.done; runner_1_1 = runner_1.next()) {
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
    return __awaiter(this, void 0, void 0, function () {
        var runner, runner_2, runner_2_1, v, out, e_2_1;
        var e_2, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    runner = new RunnerIterator(sourceValues, verbose, interruptedAsFailure);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    runner_2 = __values(runner), runner_2_1 = runner_2.next();
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
    var pathStream = stream(valueProducers)
        .drop(pathPoints.length > 0 ? +pathPoints[0] : 0)
        .map(function (producer) { return producer(); });
    var adaptedPath = __spread(['0'], pathPoints.slice(1)).join(':');
    return stream(pathWalk(adaptedPath, pathStream)).map(function (v) { return function () { return v; }; });
}
function buildInitialValues(valueProducers, qParams) {
    var rawValues = qParams.path.length === 0 ? stream(valueProducers) : runnerPathWalker(valueProducers, qParams.path);
    if (!qParams.endOnFailure)
        return rawValues;
    return rawValues.map(function (shrinkableGen) {
        return function () {
            var s = shrinkableGen();
            return new Shrinkable(s.value_);
        };
    });
}
function check(rawProperty, params) {
    if (rawProperty == null || rawProperty.generate == null)
        throw new Error('Invalid property encountered, please use a valid property');
    if (rawProperty.run == null)
        throw new Error('Invalid property encountered, please use a valid property not an arbitrary');
    var qParams = QualifiedParameters.read(__assign(__assign({}, readConfigureGlobal()), params));
    var property = decorateProperty(rawProperty, qParams);
    var generator = toss(property, qParams.seed, qParams.randomType, qParams.examples);
    var maxInitialIterations = qParams.path.indexOf(':') === -1 ? qParams.numRuns : -1;
    var maxSkips = qParams.numRuns * qParams.maxSkipsPerRun;
    var initialValues = buildInitialValues(generator, qParams);
    var sourceValues = new SourceValuesIterator(initialValues, maxInitialIterations, maxSkips);
    return property.isAsync()
        ? asyncRunIt(property, sourceValues, qParams.verbose, qParams.markInterruptAsFailure).then(function (e) {
            return e.toRunDetails(qParams.seed, qParams.path, qParams.numRuns, maxSkips);
        })
        : runIt(property, sourceValues, qParams.verbose, qParams.markInterruptAsFailure).toRunDetails(qParams.seed, qParams.path, qParams.numRuns, maxSkips);
}
function assert(property, params) {
    var out = check(property, params);
    if (property.isAsync())
        return out.then(throwIfFailed);
    else
        throwIfFailed(out);
}
export { check, assert };
