"use strict";
exports.__esModule = true;
var PreconditionFailure_1 = require("../precondition/PreconditionFailure");
var SkipAfterProperty = (function () {
    function SkipAfterProperty(property, getTime, timeLimit, interruptExecution) {
        var _this = this;
        this.property = property;
        this.getTime = getTime;
        this.interruptExecution = interruptExecution;
        this.isAsync = function () { return _this.property.isAsync(); };
        this.generate = function (mrng, runId) { return _this.property.generate(mrng, runId); };
        this.run = function (v) {
            if (_this.getTime() >= _this.skipAfterTime) {
                var preconditionFailure = new PreconditionFailure_1.PreconditionFailure(_this.interruptExecution);
                if (_this.isAsync()) {
                    return Promise.resolve(preconditionFailure);
                }
                else {
                    return preconditionFailure;
                }
            }
            return _this.property.run(v);
        };
        this.skipAfterTime = this.getTime() + timeLimit;
    }
    return SkipAfterProperty;
}());
exports.SkipAfterProperty = SkipAfterProperty;
