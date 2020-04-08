"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var StreamHelpers_1 = require("./StreamHelpers");
var Stream = (function () {
    function Stream(g) {
        this.g = g;
    }
    Stream.nil = function () {
        return new Stream(StreamHelpers_1.nilHelper());
    };
    Stream.prototype.next = function () {
        return this.g.next();
    };
    Stream.prototype[Symbol.iterator] = function () {
        return this.g;
    };
    Stream.prototype.map = function (f) {
        return new Stream(StreamHelpers_1.mapHelper(this.g, f));
    };
    Stream.prototype.flatMap = function (f) {
        return new Stream(StreamHelpers_1.flatMapHelper(this.g, f));
    };
    Stream.prototype.dropWhile = function (f) {
        var foundEligible = false;
        function helper(v) {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(foundEligible || !f(v))) return [3, 2];
                        foundEligible = true;
                        return [4, v];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        }
        return this.flatMap(helper);
    };
    Stream.prototype.drop = function (n) {
        var idx = 0;
        function helper() {
            return idx++ < n;
        }
        return this.dropWhile(helper);
    };
    Stream.prototype.takeWhile = function (f) {
        return new Stream(StreamHelpers_1.takeWhileHelper(this.g, f));
    };
    Stream.prototype.take = function (n) {
        var idx = 0;
        function helper() {
            return idx++ < n;
        }
        return this.takeWhile(helper);
    };
    Stream.prototype.filter = function (f) {
        return new Stream(StreamHelpers_1.filterHelper(this.g, f));
    };
    Stream.prototype.every = function (f) {
        var e_1, _a;
        try {
            for (var _b = tslib_1.__values(this.g), _c = _b.next(); !_c.done; _c = _b.next()) {
                var v = _c.value;
                if (!f(v)) {
                    return false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return true;
    };
    Stream.prototype.has = function (f) {
        var e_2, _a;
        try {
            for (var _b = tslib_1.__values(this.g), _c = _b.next(); !_c.done; _c = _b.next()) {
                var v = _c.value;
                if (f(v)) {
                    return [true, v];
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return [false, null];
    };
    Stream.prototype.join = function () {
        var others = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            others[_i] = arguments[_i];
        }
        return new Stream(StreamHelpers_1.joinHelper(this.g, others));
    };
    Stream.prototype.getNthOrLast = function (nth) {
        var e_3, _a;
        var remaining = nth;
        var last = null;
        try {
            for (var _b = tslib_1.__values(this.g), _c = _b.next(); !_c.done; _c = _b.next()) {
                var v = _c.value;
                if (remaining-- === 0)
                    return v;
                last = v;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return last;
    };
    return Stream;
}());
exports.Stream = Stream;
function stream(g) {
    return new Stream(g);
}
exports.stream = stream;
