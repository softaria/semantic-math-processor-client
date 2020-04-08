import { PreconditionFailure } from './PreconditionFailure.js';
export var pre = function (expectTruthy) {
    if (!expectTruthy) {
        throw new PreconditionFailure();
    }
};
