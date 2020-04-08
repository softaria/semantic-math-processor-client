"use strict";
exports.__esModule = true;
var prand = require("pure-rand");
var Random = (function () {
    function Random(internalRng) {
        this.internalRng = internalRng;
    }
    Random.prototype.clone = function () {
        return new Random(this.internalRng);
    };
    Random.prototype.uniformIn = function (rangeMin, rangeMax) {
        var g = prand.uniformIntDistribution(rangeMin, rangeMax, this.internalRng);
        this.internalRng = g[1];
        return g[0];
    };
    Random.prototype.next = function (bits) {
        return this.uniformIn(0, (1 << bits) - 1);
    };
    Random.prototype.nextBoolean = function () {
        return this.uniformIn(0, 1) === 1;
    };
    Random.prototype.nextInt = function (min, max) {
        return this.uniformIn(min == null ? Random.MIN_INT : min, max == null ? Random.MAX_INT : max);
    };
    Random.prototype.nextBigInt = function (min, max) {
        var g = prand.uniformBigIntDistribution(min, max, this.internalRng);
        this.internalRng = g[1];
        return g[0];
    };
    Random.prototype.nextDouble = function () {
        var a = this.next(26);
        var b = this.next(27);
        return (a * Random.DBL_FACTOR + b) * Random.DBL_DIVISOR;
    };
    Random.MIN_INT = 0x80000000 | 0;
    Random.MAX_INT = 0x7fffffff | 0;
    Random.DBL_FACTOR = Math.pow(2, 27);
    Random.DBL_DIVISOR = Math.pow(2, -53);
    return Random;
}());
exports.Random = Random;
