"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var Arbitrary_1 = require("./definition/Arbitrary");
var LazyArbitrary = (function (_super) {
    tslib_1.__extends(LazyArbitrary, _super);
    function LazyArbitrary(name) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.numBiasLevels = 0;
        _this.lastBiasedArbitrary = null;
        _this.underlying = null;
        return _this;
    }
    LazyArbitrary.prototype.generate = function (mrng) {
        if (!this.underlying) {
            throw new Error("Lazy arbitrary " + JSON.stringify(this.name) + " not correctly initialized");
        }
        return this.underlying.generate(mrng);
    };
    LazyArbitrary.prototype.withBias = function (freq) {
        if (!this.underlying) {
            throw new Error("Lazy arbitrary " + JSON.stringify(this.name) + " not correctly initialized");
        }
        if (this.numBiasLevels >= LazyArbitrary.MaxBiasLevels) {
            return this;
        }
        if (this.lastBiasedArbitrary !== null &&
            this.lastBiasedArbitrary.freq === freq &&
            this.lastBiasedArbitrary.arb === this.underlying &&
            this.lastBiasedArbitrary.lvl === this.numBiasLevels) {
            return this.lastBiasedArbitrary.biasedArb;
        }
        ++this.numBiasLevels;
        var biasedArb = this.underlying.withBias(freq);
        --this.numBiasLevels;
        this.lastBiasedArbitrary = {
            arb: this.underlying,
            lvl: this.numBiasLevels,
            freq: freq,
            biasedArb: biasedArb
        };
        return biasedArb;
    };
    LazyArbitrary.MaxBiasLevels = 5;
    return LazyArbitrary;
}(Arbitrary_1.Arbitrary));
exports.LazyArbitrary = LazyArbitrary;
function isLazyArbitrary(arb) {
    return typeof arb === 'object' && arb !== null && Object.prototype.hasOwnProperty.call(arb, 'underlying');
}
function updateLazy(strictArbs, lazyArbs, key) {
    var lazyAtKey = lazyArbs[key];
    var lazyArb = isLazyArbitrary(lazyAtKey) ? lazyAtKey : new LazyArbitrary(key);
    lazyArb.underlying = strictArbs[key];
    lazyArbs[key] = lazyArb;
}
function letrec(builder) {
    var lazyArbs = Object.create(null);
    var tie = function (key) {
        if (!Object.prototype.hasOwnProperty.call(lazyArbs, key))
            lazyArbs[key] = new LazyArbitrary(key);
        return lazyArbs[key];
    };
    var strictArbs = builder(tie);
    for (var key in strictArbs) {
        if (!Object.prototype.hasOwnProperty.call(strictArbs, key)) {
            continue;
        }
        updateLazy(strictArbs, lazyArbs, key);
    }
    if (!Object.prototype.hasOwnProperty.call(strictArbs, '__proto__') &&
        isLazyArbitrary(strictArbs['__proto__'])) {
        updateLazy(strictArbs, lazyArbs, '__proto__');
    }
    return strictArbs;
}
exports.letrec = letrec;
