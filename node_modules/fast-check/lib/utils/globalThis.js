"use strict";
exports.__esModule = true;
var internalGlobalThis = (function (global) {
    return global.globalThis ? global.globalThis : global;
})(typeof this === 'object' ? this : Function('return this')());
exports.getGlobal = function () { return internalGlobalThis; };
