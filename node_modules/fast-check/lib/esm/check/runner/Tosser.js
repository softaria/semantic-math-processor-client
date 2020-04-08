import { __generator, __values } from "tslib";
import * as prand from 'pure-rand';
import { Random } from '../../random/generator/Random.js';
import { Shrinkable } from '../arbitrary/definition/Shrinkable.js';
function lazyGenerate(generator, rng, idx) {
    return function () { return generator.generate(new Random(rng), idx); };
}
export function toss(generator, seed, random, examples) {
    var idx, rng;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [5, __values(examples.map(function (e) { return function () { return new Shrinkable(e); }; }))];
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
