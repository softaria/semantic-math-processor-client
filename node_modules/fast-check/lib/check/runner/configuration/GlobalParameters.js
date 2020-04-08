"use strict";
exports.__esModule = true;
var globalThis_1 = require("../../../utils/globalThis");
var globalParametersSymbol = Symbol["for"]('fast-check/GlobalParameters');
exports.configureGlobal = function (parameters) {
    globalThis_1.getGlobal()[globalParametersSymbol] = parameters;
};
exports.readConfigureGlobal = function () {
    return globalThis_1.getGlobal()[globalParametersSymbol];
};
exports.resetConfigureGlobal = function () {
    delete globalThis_1.getGlobal()[globalParametersSymbol];
};
