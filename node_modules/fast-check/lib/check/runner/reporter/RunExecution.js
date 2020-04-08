"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var VerbosityLevel_1 = require("../configuration/VerbosityLevel");
var ExecutionStatus_1 = require("./ExecutionStatus");
var RunExecution = (function () {
    function RunExecution(verbosity, interruptedAsFailure) {
        var _this = this;
        this.verbosity = verbosity;
        this.interruptedAsFailure = interruptedAsFailure;
        this.isSuccess = function () { return _this.pathToFailure == null; };
        this.firstFailure = function () { return (_this.pathToFailure ? +_this.pathToFailure.split(':')[0] : -1); };
        this.numShrinks = function () { return (_this.pathToFailure ? _this.pathToFailure.split(':').length - 1 : 0); };
        this.rootExecutionTrees = [];
        this.currentLevelExecutionTrees = this.rootExecutionTrees;
        this.failure = null;
        this.numSkips = 0;
        this.numSuccesses = 0;
        this.interrupted = false;
    }
    RunExecution.prototype.appendExecutionTree = function (status, value) {
        var currentTree = { status: status, value: value, children: [] };
        this.currentLevelExecutionTrees.push(currentTree);
        return currentTree;
    };
    RunExecution.prototype.fail = function (value, id, message) {
        if (this.verbosity >= VerbosityLevel_1.VerbosityLevel.Verbose) {
            var currentTree = this.appendExecutionTree(ExecutionStatus_1.ExecutionStatus.Failure, value);
            this.currentLevelExecutionTrees = currentTree.children;
        }
        if (this.pathToFailure == null)
            this.pathToFailure = "" + id;
        else
            this.pathToFailure += ":" + id;
        this.value = value;
        this.failure = message;
    };
    RunExecution.prototype.skip = function (value) {
        if (this.verbosity >= VerbosityLevel_1.VerbosityLevel.VeryVerbose) {
            this.appendExecutionTree(ExecutionStatus_1.ExecutionStatus.Skipped, value);
        }
        if (this.pathToFailure == null) {
            ++this.numSkips;
        }
    };
    RunExecution.prototype.success = function (value) {
        if (this.verbosity >= VerbosityLevel_1.VerbosityLevel.VeryVerbose) {
            this.appendExecutionTree(ExecutionStatus_1.ExecutionStatus.Success, value);
        }
        if (this.pathToFailure == null) {
            ++this.numSuccesses;
        }
    };
    RunExecution.prototype.interrupt = function () {
        this.interrupted = true;
    };
    RunExecution.prototype.extractFailures = function () {
        if (this.isSuccess()) {
            return [];
        }
        var failures = [];
        var cursor = this.rootExecutionTrees;
        while (cursor.length > 0 && cursor[cursor.length - 1].status === ExecutionStatus_1.ExecutionStatus.Failure) {
            var failureTree = cursor[cursor.length - 1];
            failures.push(failureTree.value);
            cursor = failureTree.children;
        }
        return failures;
    };
    RunExecution.prototype.toRunDetails = function (seed, basePath, numRuns, maxSkips) {
        if (!this.isSuccess()) {
            return {
                failed: true,
                interrupted: this.interrupted,
                numRuns: this.firstFailure() + 1 - this.numSkips,
                numSkips: this.numSkips,
                numShrinks: this.numShrinks(),
                seed: seed,
                counterexample: this.value,
                counterexamplePath: RunExecution.mergePaths(basePath, this.pathToFailure),
                error: this.failure,
                failures: this.extractFailures(),
                executionSummary: this.rootExecutionTrees,
                verbose: this.verbosity
            };
        }
        if (this.numSkips > maxSkips) {
            return {
                failed: true,
                interrupted: this.interrupted,
                numRuns: this.numSuccesses,
                numSkips: this.numSkips,
                numShrinks: 0,
                seed: seed,
                counterexample: null,
                counterexamplePath: null,
                error: null,
                failures: [],
                executionSummary: this.rootExecutionTrees,
                verbose: this.verbosity
            };
        }
        return {
            failed: this.interrupted ? this.interruptedAsFailure : false,
            interrupted: this.interrupted,
            numRuns: this.numSuccesses,
            numSkips: this.numSkips,
            numShrinks: 0,
            seed: seed,
            counterexample: null,
            counterexamplePath: null,
            error: null,
            failures: [],
            executionSummary: this.rootExecutionTrees,
            verbose: this.verbosity
        };
    };
    RunExecution.mergePaths = function (offsetPath, path) {
        if (offsetPath.length === 0)
            return path;
        var offsetItems = offsetPath.split(':');
        var remainingItems = path.split(':');
        var middle = +offsetItems[offsetItems.length - 1] + +remainingItems[0];
        return tslib_1.__spread(offsetItems.slice(0, offsetItems.length - 1), ["" + middle], remainingItems.slice(1)).join(':');
    };
    return RunExecution;
}());
exports.RunExecution = RunExecution;
