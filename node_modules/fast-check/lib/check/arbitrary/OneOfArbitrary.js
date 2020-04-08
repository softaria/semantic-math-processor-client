"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var Arbitrary_1 = require("./definition/Arbitrary");
var OneOfArbitrary = (function (_super) {
    tslib_1.__extends(OneOfArbitrary, _super);
    function OneOfArbitrary(arbs) {
        var _this = _super.call(this) || this;
        _this.arbs = arbs;
        return _this;
    }
    OneOfArbitrary.prototype.generate = function (mrng) {
        var id = mrng.nextInt(0, this.arbs.length - 1);
        return this.arbs[id].generate(mrng);
    };
    OneOfArbitrary.prototype.withBias = function (freq) {
        return new OneOfArbitrary(this.arbs.map(function (a) { return a.withBias(freq); }));
    };
    return OneOfArbitrary;
}(Arbitrary_1.Arbitrary));
function oneof() {
    var arbs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arbs[_i] = arguments[_i];
    }
    if (arbs.length === 0) {
        throw new Error('fc.oneof expects at least one parameter');
    }
    return new OneOfArbitrary(tslib_1.__spread(arbs));
}
exports.oneof = oneof;
