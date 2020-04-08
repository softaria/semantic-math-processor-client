import { __read, __spread } from "tslib";
import { genericTuple } from '../arbitrary/TupleArbitrary.js';
import { AsyncProperty } from './AsyncProperty.generic.js';
function asyncProperty() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length < 2)
        throw new Error('asyncProperty expects at least two parameters');
    var arbs = args.slice(0, args.length - 1);
    var p = args[args.length - 1];
    return new AsyncProperty(genericTuple(arbs), function (t) { return p.apply(void 0, __spread(t)); });
}
export { asyncProperty };
