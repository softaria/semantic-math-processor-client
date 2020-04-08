import { __generator, __values } from "tslib";
var Nil = (function () {
    function Nil() {
    }
    Nil.prototype[Symbol.iterator] = function () {
        return this;
    };
    Nil.prototype.next = function (value) {
        return { value: value, done: true };
    };
    Nil.nil = new Nil();
    return Nil;
}());
export function nilHelper() {
    return Nil.nil;
}
export function mapHelper(g, f) {
    var g_1, g_1_1, v, e_1_1;
    var e_1, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, 6, 7]);
                g_1 = __values(g), g_1_1 = g_1.next();
                _b.label = 1;
            case 1:
                if (!!g_1_1.done) return [3, 4];
                v = g_1_1.value;
                return [4, f(v)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                g_1_1 = g_1.next();
                return [3, 1];
            case 4: return [3, 7];
            case 5:
                e_1_1 = _b.sent();
                e_1 = { error: e_1_1 };
                return [3, 7];
            case 6:
                try {
                    if (g_1_1 && !g_1_1.done && (_a = g_1["return"])) _a.call(g_1);
                }
                finally { if (e_1) throw e_1.error; }
                return [7];
            case 7: return [2];
        }
    });
}
export function flatMapHelper(g, f) {
    var g_2, g_2_1, v, e_2_1;
    var e_2, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, 6, 7]);
                g_2 = __values(g), g_2_1 = g_2.next();
                _b.label = 1;
            case 1:
                if (!!g_2_1.done) return [3, 4];
                v = g_2_1.value;
                return [5, __values(f(v))];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                g_2_1 = g_2.next();
                return [3, 1];
            case 4: return [3, 7];
            case 5:
                e_2_1 = _b.sent();
                e_2 = { error: e_2_1 };
                return [3, 7];
            case 6:
                try {
                    if (g_2_1 && !g_2_1.done && (_a = g_2["return"])) _a.call(g_2);
                }
                finally { if (e_2) throw e_2.error; }
                return [7];
            case 7: return [2];
        }
    });
}
export function filterHelper(g, f) {
    var g_3, g_3_1, v, e_3_1;
    var e_3, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, 6, 7]);
                g_3 = __values(g), g_3_1 = g_3.next();
                _b.label = 1;
            case 1:
                if (!!g_3_1.done) return [3, 4];
                v = g_3_1.value;
                if (!f(v)) return [3, 3];
                return [4, v];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                g_3_1 = g_3.next();
                return [3, 1];
            case 4: return [3, 7];
            case 5:
                e_3_1 = _b.sent();
                e_3 = { error: e_3_1 };
                return [3, 7];
            case 6:
                try {
                    if (g_3_1 && !g_3_1.done && (_a = g_3["return"])) _a.call(g_3);
                }
                finally { if (e_3) throw e_3.error; }
                return [7];
            case 7: return [2];
        }
    });
}
export function takeWhileHelper(g, f) {
    var cur;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cur = g.next();
                _a.label = 1;
            case 1:
                if (!(!cur.done && f(cur.value))) return [3, 3];
                return [4, cur.value];
            case 2:
                _a.sent();
                cur = g.next();
                return [3, 1];
            case 3: return [2];
        }
    });
}
export function joinHelper(g, others) {
    var cur, others_1, others_1_1, s, cur, e_4_1;
    var e_4, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                cur = g.next();
                _b.label = 1;
            case 1:
                if (!!cur.done) return [3, 4];
                return [4, cur.value];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                cur = g.next();
                return [3, 1];
            case 4:
                _b.trys.push([4, 11, 12, 13]);
                others_1 = __values(others), others_1_1 = others_1.next();
                _b.label = 5;
            case 5:
                if (!!others_1_1.done) return [3, 10];
                s = others_1_1.value;
                cur = s.next();
                _b.label = 6;
            case 6:
                if (!!cur.done) return [3, 9];
                return [4, cur.value];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8:
                cur = s.next();
                return [3, 6];
            case 9:
                others_1_1 = others_1.next();
                return [3, 5];
            case 10: return [3, 13];
            case 11:
                e_4_1 = _b.sent();
                e_4 = { error: e_4_1 };
                return [3, 13];
            case 12:
                try {
                    if (others_1_1 && !others_1_1.done && (_a = others_1["return"])) _a.call(others_1);
                }
                finally { if (e_4) throw e_4.error; }
                return [7];
            case 13: return [2];
        }
    });
}
