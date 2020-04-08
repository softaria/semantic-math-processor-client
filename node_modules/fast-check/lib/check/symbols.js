"use strict";
exports.__esModule = true;
exports.cloneMethod = Symbol["for"]('fast-check/cloneMethod');
exports.hasCloneMethod = function (instance) {
    return instance instanceof Object && typeof instance[exports.cloneMethod] === 'function';
};
