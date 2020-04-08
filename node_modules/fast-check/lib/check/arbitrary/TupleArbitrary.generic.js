"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var Stream_1 = require("../../stream/Stream");
var symbols_1 = require("../symbols");
var Arbitrary_1 = require("./definition/Arbitrary");
var Shrinkable_1 = require("./definition/Shrinkable");
var GenericTupleArbitrary = (function (_super) {
    tslib_1.__extends(GenericTupleArbitrary, _super);
    function GenericTupleArbitrary(arbs) {
        var _this = _super.call(this) || this;
        _this.arbs = arbs;
        for (var idx = 0; idx !== arbs.length; ++idx) {
            var arb = arbs[idx];
            if (arb == null || arb.generate == null)
                throw new Error("Invalid parameter encountered at index " + idx + ": expecting an Arbitrary");
        }
        return _this;
    }
    GenericTupleArbitrary.makeItCloneable = function (vs, shrinkables) {
        vs[symbols_1.cloneMethod] = function () {
            var cloned = [];
            for (var idx = 0; idx !== shrinkables.length; ++idx) {
                cloned.push(shrinkables[idx].value);
            }
            GenericTupleArbitrary.makeItCloneable(cloned, shrinkables);
            return cloned;
        };
        return vs;
    };
    GenericTupleArbitrary.wrapper = function (shrinkables) {
        var cloneable = false;
        var vs = [];
        for (var idx = 0; idx !== shrinkables.length; ++idx) {
            var s = shrinkables[idx];
            cloneable = cloneable || s.hasToBeCloned;
            vs.push(s.value);
        }
        if (cloneable) {
            GenericTupleArbitrary.makeItCloneable(vs, shrinkables);
        }
        return new Shrinkable_1.Shrinkable(vs, function () { return GenericTupleArbitrary.shrinkImpl(shrinkables).map(GenericTupleArbitrary.wrapper); });
    };
    GenericTupleArbitrary.prototype.generate = function (mrng) {
        return GenericTupleArbitrary.wrapper(this.arbs.map(function (a) { return a.generate(mrng); }));
    };
    GenericTupleArbitrary.shrinkImpl = function (value) {
        var s = Stream_1.Stream.nil();
        var _loop_1 = function (idx) {
            s = s.join(value[idx].shrink().map(function (v) {
                return value
                    .slice(0, idx)
                    .concat([v])
                    .concat(value.slice(idx + 1));
            }));
        };
        for (var idx = 0; idx !== value.length; ++idx) {
            _loop_1(idx);
        }
        return s;
    };
    GenericTupleArbitrary.prototype.withBias = function (freq) {
        return new GenericTupleArbitrary(this.arbs.map(function (a) { return a.withBias(freq); }));
    };
    return GenericTupleArbitrary;
}(Arbitrary_1.Arbitrary));
exports.GenericTupleArbitrary = GenericTupleArbitrary;
function genericTuple(arbs) {
    return new GenericTupleArbitrary(arbs);
}
exports.genericTuple = genericTuple;
