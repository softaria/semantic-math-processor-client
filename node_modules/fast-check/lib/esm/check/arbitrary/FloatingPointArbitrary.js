import { integer } from './IntegerArbitrary.js';
import { tuple } from './TupleArbitrary.js';
function next(n) {
    return integer(0, (1 << n) - 1);
}
var floatInternal = function () {
    return next(24).map(function (v) { return v / (1 << 24); });
};
function float(a, b) {
    if (a === undefined)
        return floatInternal();
    if (b === undefined)
        return floatInternal().map(function (v) { return v * a; });
    return floatInternal().map(function (v) { return a + v * (b - a); });
}
var doubleFactor = Math.pow(2, 27);
var doubleDivisor = Math.pow(2, -53);
var doubleInternal = function () {
    return tuple(next(26), next(27)).map(function (v) { return (v[0] * doubleFactor + v[1]) * doubleDivisor; });
};
function double(a, b) {
    if (a === undefined)
        return doubleInternal();
    if (b === undefined)
        return doubleInternal().map(function (v) { return v * a; });
    return doubleInternal().map(function (v) { return a + v * (b - a); });
}
export { float, double };
