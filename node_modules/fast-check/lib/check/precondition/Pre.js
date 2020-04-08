"use strict";
exports.__esModule = true;
var PreconditionFailure_1 = require("./PreconditionFailure");
exports.pre = function (expectTruthy) {
    if (!expectTruthy) {
        throw new PreconditionFailure_1.PreconditionFailure();
    }
};
