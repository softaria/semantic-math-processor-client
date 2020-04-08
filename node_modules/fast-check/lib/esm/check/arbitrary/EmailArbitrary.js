import { __read } from "tslib";
import { array } from './ArrayArbitrary.js';
import { buildLowerAlphaNumericArb } from './helpers/SpecificCharacterRange.js';
import { domain } from './HostArbitrary.js';
import { stringOf } from './StringArbitrary.js';
import { tuple } from './TupleArbitrary.js';
export function emailAddress() {
    var others = ['!', '#', '$', '%', '&', "'", '*', '+', '-', '/', '=', '?', '^', '_', '`', '{', '|', '}', '~'];
    var atextArb = buildLowerAlphaNumericArb(others);
    var dotAtomArb = array(stringOf(atextArb, 1, 10), 1, 5).map(function (a) { return a.join('.'); });
    return tuple(dotAtomArb, domain()).map(function (_a) {
        var _b = __read(_a, 2), lp = _b[0], d = _b[1];
        return lp + "@" + d;
    });
}
