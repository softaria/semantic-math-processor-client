import { __extends } from "tslib";
var PreconditionFailure = (function (_super) {
    __extends(PreconditionFailure, _super);
    function PreconditionFailure(interruptExecution) {
        if (interruptExecution === void 0) { interruptExecution = false; }
        var _this = _super.call(this) || this;
        _this.interruptExecution = interruptExecution;
        _this.footprint = PreconditionFailure.SharedFootPrint;
        return _this;
    }
    PreconditionFailure.isFailure = function (err) {
        return err != null && err.footprint === PreconditionFailure.SharedFootPrint;
    };
    PreconditionFailure.SharedFootPrint = Symbol["for"]('fast-check/PreconditionFailure');
    return PreconditionFailure;
}(Error));
export { PreconditionFailure };
