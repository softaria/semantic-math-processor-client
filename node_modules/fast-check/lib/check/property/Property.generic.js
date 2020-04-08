"use strict";
exports.__esModule = true;
var PreconditionFailure_1 = require("../precondition/PreconditionFailure");
var IRawProperty_1 = require("./IRawProperty");
var Property = (function () {
    function Property(arb, predicate) {
        this.arb = arb;
        this.predicate = predicate;
        this.beforeEachHook = Property.dummyHook;
        this.afterEachHook = Property.dummyHook;
        this.isAsync = function () { return false; };
    }
    Property.prototype.generate = function (mrng, runId) {
        return runId != null ? this.arb.withBias(IRawProperty_1.runIdToFrequency(runId)).generate(mrng) : this.arb.generate(mrng);
    };
    Property.prototype.run = function (v) {
        this.beforeEachHook();
        try {
            var output = this.predicate(v);
            return output == null || output === true ? null : 'Property failed by returning false';
        }
        catch (err) {
            if (PreconditionFailure_1.PreconditionFailure.isFailure(err))
                return err;
            if (err instanceof Error && err.stack)
                return err + "\n\nStack trace: " + err.stack;
            return "" + err;
        }
        finally {
            this.afterEachHook();
        }
    };
    Property.prototype.beforeEach = function (hookFunction) {
        this.beforeEachHook = hookFunction;
        return this;
    };
    Property.prototype.afterEach = function (hookFunction) {
        this.afterEachHook = hookFunction;
        return this;
    };
    Property.dummyHook = function () { };
    return Property;
}());
exports.Property = Property;
