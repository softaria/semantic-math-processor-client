export var cloneMethod = Symbol["for"]('fast-check/cloneMethod');
export var hasCloneMethod = function (instance) {
    return instance instanceof Object && typeof instance[cloneMethod] === 'function';
};
