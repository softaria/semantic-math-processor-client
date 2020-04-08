"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var Stream_1 = require("../../stream/Stream");
var symbols_1 = require("../symbols");
var Arbitrary_1 = require("./definition/Arbitrary");
var Shrinkable_1 = require("./definition/Shrinkable");
var DedupArbitrary = (function (_super) {
    tslib_1.__extends(DedupArbitrary, _super);
    function DedupArbitrary(arb, numValues) {
        var _this = _super.call(this) || this;
        _this.arb = arb;
        _this.numValues = numValues;
        return _this;
    }
    DedupArbitrary.prototype.generate = function (mrng) {
        var items = [];
        if (this.numValues <= 0) {
            return this.wrapper(items);
        }
        for (var idx = 0; idx !== this.numValues - 1; ++idx) {
            items.push(this.arb.generate(mrng.clone()));
        }
        items.push(this.arb.generate(mrng));
        return this.wrapper(items);
    };
    DedupArbitrary.makeItCloneable = function (vs, shrinkables) {
        var _this = this;
        vs[symbols_1.cloneMethod] = function () {
            var cloned = [];
            for (var idx = 0; idx !== shrinkables.length; ++idx) {
                cloned.push(shrinkables[idx].value);
            }
            _this.makeItCloneable(cloned, shrinkables);
            return cloned;
        };
        return vs;
    };
    DedupArbitrary.prototype.wrapper = function (items) {
        var _this = this;
        var cloneable = false;
        var vs = [];
        for (var idx = 0; idx !== items.length; ++idx) {
            var s = items[idx];
            cloneable = cloneable || s.hasToBeCloned;
            vs.push(s.value);
        }
        if (cloneable) {
            DedupArbitrary.makeItCloneable(vs, items);
        }
        return new Shrinkable_1.Shrinkable(vs, function () { return Stream_1.stream(_this.shrinkImpl(items)).map(function (v) { return _this.wrapper(v); }); });
    };
    DedupArbitrary.prototype.shrinkImpl = function (items) {
        var its, cur;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (items.length === 0) {
                        return [2];
                    }
                    its = items.map(function (s) { return s.shrink()[Symbol.iterator](); });
                    cur = its.map(function (it) { return it.next(); });
                    _a.label = 1;
                case 1:
                    if (!!cur[0].done) return [3, 3];
                    return [4, cur.map(function (c) { return c.value; })];
                case 2:
                    _a.sent();
                    cur = its.map(function (it) { return it.next(); });
                    return [3, 1];
                case 3: return [2];
            }
        });
    };
    return DedupArbitrary;
}(Arbitrary_1.Arbitrary));
function dedup(arb, numValues) {
    return new DedupArbitrary(arb, numValues);
}
exports.dedup = dedup;
