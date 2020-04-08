import { GenericTupleArbitrary } from './TupleArbitrary.generic.js';
function tuple() {
    var arbs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arbs[_i] = arguments[_i];
    }
    return new GenericTupleArbitrary(arbs);
}
export { tuple };
