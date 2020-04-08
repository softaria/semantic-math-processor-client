"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var PreconditionFailure_1 = require("../precondition/PreconditionFailure");
var IRawProperty_1 = require("./IRawProperty");
var AsyncProperty = (function () {
    function AsyncProperty(arb, predicate) {
        this.arb = arb;
        this.predicate = predicate;
        this.beforeEachHook = AsyncProperty.dummyHook;
        this.afterEachHook = AsyncProperty.dummyHook;
        this.isAsync = function () { return true; };
    }
    AsyncProperty.prototype.generate = function (mrng, runId) {
        return runId != null ? this.arb.withBias(IRawProperty_1.runIdToFrequency(runId)).generate(mrng) : this.arb.generate(mrng);
    };
    AsyncProperty.prototype.run = function (v) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var output, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.beforeEachHook()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, 5, 7]);
                        return [4, this.predicate(v)];
                    case 3:
                        output = _a.sent();
                        return [2, output == null || output === true ? null : 'Property failed by returning false'];
                    case 4:
                        err_1 = _a.sent();
                        if (PreconditionFailure_1.PreconditionFailure.isFailure(err_1))
                            return [2, err_1];
                        if (err_1 instanceof Error && err_1.stack)
                            return [2, err_1 + "\n\nStack trace: " + err_1.stack];
                        return [2, "" + err_1];
                    case 5: return [4, this.afterEachHook()];
                    case 6:
                        _a.sent();
                        return [7];
                    case 7: return [2];
                }
            });
        });
    };
    AsyncProperty.prototype.beforeEach = function (hookFunction) {
        this.beforeEachHook = hookFunction;
        return this;
    };
    AsyncProperty.prototype.afterEach = function (hookFunction) {
        this.afterEachHook = hookFunction;
        return this;
    };
    AsyncProperty.dummyHook = function () { };
    return AsyncProperty;
}());
exports.AsyncProperty = AsyncProperty;
