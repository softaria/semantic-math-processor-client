"use strict";
exports.__esModule = true;
var RunExecution_1 = require("./reporter/RunExecution");
var RunnerIterator = (function () {
    function RunnerIterator(sourceValues, verbose, interruptedAsFailure) {
        this.sourceValues = sourceValues;
        this.runExecution = new RunExecution_1.RunExecution(verbose, interruptedAsFailure);
        this.currentIdx = -1;
        this.nextValues = sourceValues;
    }
    RunnerIterator.prototype[Symbol.iterator] = function () {
        return this;
    };
    RunnerIterator.prototype.next = function (value) {
        var nextValue = this.nextValues.next();
        if (nextValue.done || this.runExecution.interrupted) {
            return { done: true, value: value };
        }
        this.currentShrinkable = nextValue.value;
        ++this.currentIdx;
        return { done: false, value: nextValue.value.value_ };
    };
    RunnerIterator.prototype.handleResult = function (result) {
        if (result != null && typeof result === 'string') {
            this.runExecution.fail(this.currentShrinkable.value_, this.currentIdx, result);
            this.currentIdx = -1;
            this.nextValues = this.currentShrinkable.shrink();
        }
        else if (result != null) {
            if (!result.interruptExecution) {
                this.runExecution.skip(this.currentShrinkable.value_);
                this.sourceValues.skippedOne();
            }
            else {
                this.runExecution.interrupt();
            }
        }
        else {
            this.runExecution.success(this.currentShrinkable.value_);
        }
    };
    return RunnerIterator;
}());
exports.RunnerIterator = RunnerIterator;
