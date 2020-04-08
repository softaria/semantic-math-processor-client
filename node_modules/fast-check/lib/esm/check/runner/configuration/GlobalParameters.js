import { getGlobal } from '../../../utils/globalThis.js';
var globalParametersSymbol = Symbol["for"]('fast-check/GlobalParameters');
export var configureGlobal = function (parameters) {
    getGlobal()[globalParametersSymbol] = parameters;
};
export var readConfigureGlobal = function () {
    return getGlobal()[globalParametersSymbol];
};
export var resetConfigureGlobal = function () {
    delete getGlobal()[globalParametersSymbol];
};
