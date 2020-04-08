"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var prand = require("pure-rand");
var Random_1 = require("../../random/generator/Random");
var Shrinkable_1 = require("../arbitrary/definition/Shrinkable");
function lazyGenerate(generator, rng, idx) {
    return function () { return generator.generate(new Random_1.Random(rng), idx); };
}
function toss(generator, seed, random, examples) {
    var idx, rng;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [5, tslib_1.__values(examples.map(function (e) { return function () { return new Shrinkable_1.Shrinkable(e); }; }))];
            case 1:
                _a.sent();
                idx = 0;
                rng = random(seed);
                _a.label = 2;
            case 2:
                rng = rng.jump ? rng.jump() : prand.skipN(rng, 42);
                return [4, lazyGenerate(generator, rng, idx++)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [3, 2];
            case 5: return [2];
        }
    });
}
exports.toss = toss;
