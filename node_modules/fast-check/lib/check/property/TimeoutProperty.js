"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var timeoutAfter = function (timeMs) {
    var timeoutHandle = null;
    var promise = new Promise(function (resolve) {
        timeoutHandle = setTimeout(function () {
            resolve("Property timeout: exceeded limit of " + timeMs + " milliseconds");
        }, timeMs);
    });
    return {
        clear: function () { return clearTimeout(timeoutHandle); },
        promise: promise
    };
};
var TimeoutProperty = (function () {
    function TimeoutProperty(property, timeMs) {
        this.property = property;
        this.timeMs = timeMs;
        this.isAsync = function () { return true; };
    }
    TimeoutProperty.prototype.generate = function (mrng, runId) {
        return this.property.generate(mrng, runId);
    };
    TimeoutProperty.prototype.run = function (v) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var t, propRun;
            return tslib_1.__generator(this, function (_a) {
                t = timeoutAfter(this.timeMs);
                propRun = Promise.race([this.property.run(v), t.promise]);
                propRun.then(t.clear, t.clear);
                return [2, propRun];
            });
        });
    };
    return TimeoutProperty;
}());
exports.TimeoutProperty = TimeoutProperty;
