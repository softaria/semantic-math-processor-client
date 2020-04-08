"use strict";
exports.__esModule = true;
var pure_rand_1 = require("pure-rand");
var VerbosityLevel_1 = require("./VerbosityLevel");
var QualifiedParameters = (function () {
    function QualifiedParameters(op) {
        var p = op || {};
        this.seed = QualifiedParameters.readSeed(p);
        this.randomType = QualifiedParameters.readRandomType(p);
        this.numRuns = QualifiedParameters.readNumRuns(p);
        this.verbose = QualifiedParameters.readVerbose(p);
        this.maxSkipsPerRun = QualifiedParameters.readOrDefault(p, 'maxSkipsPerRun', 100);
        this.timeout = QualifiedParameters.readOrDefault(p, 'timeout', null);
        this.skipAllAfterTimeLimit = QualifiedParameters.readOrDefault(p, 'skipAllAfterTimeLimit', null);
        this.interruptAfterTimeLimit = QualifiedParameters.readOrDefault(p, 'interruptAfterTimeLimit', null);
        this.markInterruptAsFailure = QualifiedParameters.readBoolean(p, 'markInterruptAsFailure');
        this.logger = QualifiedParameters.readOrDefault(p, 'logger', function (v) {
            console.log(v);
        });
        this.path = QualifiedParameters.readOrDefault(p, 'path', '');
        this.unbiased = QualifiedParameters.readBoolean(p, 'unbiased');
        this.examples = QualifiedParameters.readOrDefault(p, 'examples', []);
        this.endOnFailure = QualifiedParameters.readBoolean(p, 'endOnFailure');
    }
    QualifiedParameters.read = function (op) {
        return new QualifiedParameters(op);
    };
    QualifiedParameters.readSeed = function (p) {
        if (p.seed == null)
            return Date.now() ^ (Math.random() * 0x100000000);
        var seed32 = p.seed | 0;
        if (p.seed === seed32)
            return seed32;
        var gap = p.seed - seed32;
        return seed32 ^ (gap * 0x100000000);
    };
    QualifiedParameters.readRandomType = function (p) {
        if (p.randomType == null)
            return pure_rand_1["default"].xorshift128plus;
        if (typeof p.randomType === 'string') {
            switch (p.randomType) {
                case 'mersenne':
                    return pure_rand_1["default"].mersenne;
                case 'congruential':
                    return pure_rand_1["default"].congruential;
                case 'congruential32':
                    return pure_rand_1["default"].congruential32;
                case 'xorshift128plus':
                    return pure_rand_1["default"].xorshift128plus;
                case 'xoroshiro128plus':
                    return pure_rand_1["default"].xoroshiro128plus;
                default:
                    throw new Error("Invalid random specified: '" + p.randomType + "'");
            }
        }
        return p.randomType;
    };
    QualifiedParameters.readNumRuns = function (p) {
        var defaultValue = 100;
        if (p.numRuns != null)
            return p.numRuns;
        if (p.num_runs != null)
            return p.num_runs;
        return defaultValue;
    };
    QualifiedParameters.readVerbose = function (p) {
        if (p.verbose == null)
            return VerbosityLevel_1.VerbosityLevel.None;
        if (typeof p.verbose === 'boolean') {
            return p.verbose === true ? VerbosityLevel_1.VerbosityLevel.Verbose : VerbosityLevel_1.VerbosityLevel.None;
        }
        if (p.verbose <= VerbosityLevel_1.VerbosityLevel.None) {
            return VerbosityLevel_1.VerbosityLevel.None;
        }
        if (p.verbose >= VerbosityLevel_1.VerbosityLevel.VeryVerbose) {
            return VerbosityLevel_1.VerbosityLevel.VeryVerbose;
        }
        return p.verbose | 0;
    };
    QualifiedParameters.readBoolean = function (p, key) { return p[key] === true; };
    QualifiedParameters.readOrDefault = function (p, key, defaultValue) { return (p[key] != null ? p[key] : defaultValue); };
    return QualifiedParameters;
}());
exports.QualifiedParameters = QualifiedParameters;
