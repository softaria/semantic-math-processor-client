"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var Arbitrary_1 = require("./Arbitrary");
var Shrinkable_1 = require("./Shrinkable");
var ArbitraryWithShrink = (function (_super) {
    tslib_1.__extends(ArbitraryWithShrink, _super);
    function ArbitraryWithShrink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArbitraryWithShrink.prototype.shrinkableFor = function (value, shrunkOnce) {
        var _this = this;
        return new Shrinkable_1.Shrinkable(value, function () { return _this.shrink(value, shrunkOnce === true).map(function (v) { return _this.shrinkableFor(v, true); }); });
    };
    return ArbitraryWithShrink;
}(Arbitrary_1.Arbitrary));
exports.ArbitraryWithShrink = ArbitraryWithShrink;
