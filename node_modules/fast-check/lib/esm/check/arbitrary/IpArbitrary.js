import { __read } from "tslib";
import { array } from './ArrayArbitrary.js';
import { constantFrom } from './ConstantArbitrary.js';
import { nat } from './IntegerArbitrary.js';
import { oneof } from './OneOfArbitrary.js';
import { hexaString } from './StringArbitrary.js';
import { tuple } from './TupleArbitrary.js';
function ipV4() {
    return tuple(nat(255), nat(255), nat(255), nat(255)).map(function (_a) {
        var _b = __read(_a, 4), a = _b[0], b = _b[1], c = _b[2], d = _b[3];
        return a + "." + b + "." + c + "." + d;
    });
}
function ipV4Extended() {
    var natRepr = function (maxValue) {
        return tuple(constantFrom('dec', 'oct', 'hex'), nat(maxValue)).map(function (_a) {
            var _b = __read(_a, 2), style = _b[0], v = _b[1];
            switch (style) {
                case 'oct':
                    return "0" + Number(v).toString(8);
                case 'hex':
                    return "0x" + Number(v).toString(16);
                case 'dec':
                default:
                    return "" + v;
            }
        });
    };
    return oneof(tuple(natRepr(255), natRepr(255), natRepr(255), natRepr(255)).map(function (_a) {
        var _b = __read(_a, 4), a = _b[0], b = _b[1], c = _b[2], d = _b[3];
        return a + "." + b + "." + c + "." + d;
    }), tuple(natRepr(255), natRepr(255), natRepr(65535)).map(function (_a) {
        var _b = __read(_a, 3), a = _b[0], b = _b[1], c = _b[2];
        return a + "." + b + "." + c;
    }), tuple(natRepr(255), natRepr(16777215)).map(function (_a) {
        var _b = __read(_a, 2), a = _b[0], b = _b[1];
        return a + "." + b;
    }), natRepr(4294967295));
}
function ipV6() {
    var h16Arb = hexaString(1, 4);
    var ls32Arb = oneof(tuple(h16Arb, h16Arb).map(function (_a) {
        var _b = __read(_a, 2), a = _b[0], b = _b[1];
        return a + ":" + b;
    }), ipV4());
    return oneof(tuple(array(h16Arb, 6, 6), ls32Arb).map(function (_a) {
        var _b = __read(_a, 2), eh = _b[0], l = _b[1];
        return eh.join(':') + ":" + l;
    }), tuple(array(h16Arb, 5, 5), ls32Arb).map(function (_a) {
        var _b = __read(_a, 2), eh = _b[0], l = _b[1];
        return "::" + eh.join(':') + ":" + l;
    }), tuple(array(h16Arb, 0, 1), array(h16Arb, 4, 4), ls32Arb).map(function (_a) {
        var _b = __read(_a, 3), bh = _b[0], eh = _b[1], l = _b[2];
        return bh.join(':') + "::" + eh.join(':') + ":" + l;
    }), tuple(array(h16Arb, 0, 2), array(h16Arb, 3, 3), ls32Arb).map(function (_a) {
        var _b = __read(_a, 3), bh = _b[0], eh = _b[1], l = _b[2];
        return bh.join(':') + "::" + eh.join(':') + ":" + l;
    }), tuple(array(h16Arb, 0, 3), array(h16Arb, 2, 2), ls32Arb).map(function (_a) {
        var _b = __read(_a, 3), bh = _b[0], eh = _b[1], l = _b[2];
        return bh.join(':') + "::" + eh.join(':') + ":" + l;
    }), tuple(array(h16Arb, 0, 4), h16Arb, ls32Arb).map(function (_a) {
        var _b = __read(_a, 3), bh = _b[0], eh = _b[1], l = _b[2];
        return bh.join(':') + "::" + eh + ":" + l;
    }), tuple(array(h16Arb, 0, 5), ls32Arb).map(function (_a) {
        var _b = __read(_a, 2), bh = _b[0], l = _b[1];
        return bh.join(':') + "::" + l;
    }), tuple(array(h16Arb, 0, 6), h16Arb).map(function (_a) {
        var _b = __read(_a, 2), bh = _b[0], eh = _b[1];
        return bh.join(':') + "::" + eh;
    }), tuple(array(h16Arb, 0, 7)).map(function (_a) {
        var _b = __read(_a, 1), bh = _b[0];
        return bh.join(':') + "::";
    }));
}
export { ipV4, ipV4Extended, ipV6 };
