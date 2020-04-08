"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var Stream_1 = require("../../stream/Stream");
var stringify_1 = require("../../utils/stringify");
var symbols_1 = require("../symbols");
var Arbitrary_1 = require("./definition/Arbitrary");
var BiasedArbitraryWrapper_1 = require("./definition/BiasedArbitraryWrapper");
var Shrinkable_1 = require("./definition/Shrinkable");
var StreamArbitrary = (function (_super) {
    tslib_1.__extends(StreamArbitrary, _super);
    function StreamArbitrary(arb) {
        var _this = _super.call(this) || this;
        _this.arb = arb;
        return _this;
    }
    StreamArbitrary.prototype.generate = function (mrng) {
        var _this = this;
        var g = function (arb, clonedMrng) {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!true) return [3, 2];
                        return [4, arb.generate(clonedMrng).value_];
                    case 1:
                        _a.sent();
                        return [3, 0];
                    case 2: return [2];
                }
            });
        };
        var producer = function () { return new Stream_1.Stream(g(_this.arb, mrng.clone())); };
        var toString = function () {
            return "Stream(" + tslib_1.__spread(producer()
                .take(10)
                .map(stringify_1.stringify)).join(',') + "...)";
        };
        var enrichedProducer = function () {
            var _a;
            return Object.assign(producer(), (_a = { toString: toString }, _a[symbols_1.cloneMethod] = enrichedProducer, _a));
        };
        return new Shrinkable_1.Shrinkable(enrichedProducer());
    };
    StreamArbitrary.prototype.withBias = function (freq) {
        var _this = this;
        return BiasedArbitraryWrapper_1.biasWrapper(freq, this, function () { return new StreamArbitrary(_this.arb.withBias(freq)); });
    };
    return StreamArbitrary;
}(Arbitrary_1.Arbitrary));
function infiniteStream(arb) {
    return new StreamArbitrary(arb);
}
exports.infiniteStream = infiniteStream;
