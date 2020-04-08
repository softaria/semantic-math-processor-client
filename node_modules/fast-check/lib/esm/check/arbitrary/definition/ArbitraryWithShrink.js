import { __extends } from "tslib";
import { Arbitrary } from './Arbitrary.js';
import { Shrinkable } from './Shrinkable.js';
var ArbitraryWithShrink = (function (_super) {
    __extends(ArbitraryWithShrink, _super);
    function ArbitraryWithShrink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArbitraryWithShrink.prototype.shrinkableFor = function (value, shrunkOnce) {
        var _this = this;
        return new Shrinkable(value, function () { return _this.shrink(value, shrunkOnce === true).map(function (v) { return _this.shrinkableFor(v, true); }); });
    };
    return ArbitraryWithShrink;
}(Arbitrary));
export { ArbitraryWithShrink };
