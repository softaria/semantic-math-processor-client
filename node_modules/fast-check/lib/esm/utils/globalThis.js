var internalGlobalThis = (function (global) {
    return global.globalThis ? global.globalThis : global;
})(typeof this === 'object' ? this : Function('return this')());
export var getGlobal = function () { return internalGlobalThis; };
