import { __read } from "tslib";
import { array } from './ArrayArbitrary.js';
import { buildAlphaNumericPercentArb, buildLowerAlphaArb, buildLowerAlphaNumericArb } from './helpers/SpecificCharacterRange.js';
import { option } from './OptionArbitrary.js';
import { stringOf } from './StringArbitrary.js';
import { tuple } from './TupleArbitrary.js';
function subdomain() {
    var alphaNumericArb = buildLowerAlphaNumericArb([]);
    var alphaNumericHyphenArb = buildLowerAlphaNumericArb(['-']);
    return tuple(alphaNumericArb, option(tuple(stringOf(alphaNumericHyphenArb), alphaNumericArb)))
        .map(function (_a) {
        var _b = __read(_a, 2), f = _b[0], d = _b[1];
        return (d === null ? f : "" + f + d[0] + d[1]);
    })
        .filter(function (d) { return d.length <= 63; })
        .filter(function (d) {
        return d.length < 4 || d[0] !== 'x' || d[1] !== 'n' || d[2] !== '-' || d[3] !== '-';
    });
}
export function domain() {
    var alphaNumericArb = buildLowerAlphaArb([]);
    var extensionArb = stringOf(alphaNumericArb, 2, 10);
    return tuple(array(subdomain(), 1, 5), extensionArb)
        .map(function (_a) {
        var _b = __read(_a, 2), mid = _b[0], ext = _b[1];
        return mid.join('.') + "." + ext;
    })
        .filter(function (d) { return d.length <= 255; });
}
export function hostUserInfo() {
    var others = ['-', '.', '_', '~', '!', '$', '&', "'", '(', ')', '*', '+', ',', ';', '=', ':'];
    return stringOf(buildAlphaNumericPercentArb(others));
}
