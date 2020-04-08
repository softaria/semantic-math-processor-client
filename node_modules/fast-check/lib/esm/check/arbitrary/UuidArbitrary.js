import { StringPadStart } from '../../utils/polyfills.js';
import { integer, nat } from './IntegerArbitrary.js';
import { tuple } from './TupleArbitrary.js';
var padEight = function (arb) { return arb.map(function (n) { return StringPadStart(n.toString(16), 8, '0'); }); };
export function uuid() {
    var padded = padEight(nat(0xffffffff));
    var secondPadded = padEight(integer(0x10000000, 0x5fffffff));
    var thirdPadded = padEight(integer(0x80000000, 0xbfffffff));
    return tuple(padded, secondPadded, thirdPadded, padded).map(function (t) {
        return t[0] + "-" + t[1].substring(4) + "-" + t[1].substring(0, 4) + "-" + t[2].substring(0, 4) + "-" + t[2].substring(4) + t[3];
    });
}
export function uuidV(versionNumber) {
    var padded = padEight(nat(0xffffffff));
    var secondPadded = padEight(nat(0x0fffffff));
    var thirdPadded = padEight(integer(0x80000000, 0xbfffffff));
    return tuple(padded, secondPadded, thirdPadded, padded).map(function (t) {
        return t[0] + "-" + t[1].substring(4) + "-" + versionNumber + t[1].substring(1, 4) + "-" + t[2].substring(0, 4) + "-" + t[2].substring(4) + t[3];
    });
}
