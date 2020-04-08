import { Random } from '../../random/generator/Random';
import { Arbitrary } from './definition/Arbitrary';
import { Shrinkable } from './definition/Shrinkable';
/** @hidden */
declare class GenericTupleArbitrary<Ts> extends Arbitrary<Ts[]> {
    readonly arbs: Arbitrary<Ts>[];
    constructor(arbs: Arbitrary<Ts>[]);
    private static makeItCloneable;
    private static wrapper;
    generate(mrng: Random): Shrinkable<Ts[]>;
    private static shrinkImpl;
    withBias(freq: number): GenericTupleArbitrary<Ts>;
}
/**
 * For tuples produced by the provided `arbs`
 * @param arbs Ordered list of arbitraries
 */
declare function genericTuple<Ts>(arbs: Arbitrary<Ts>[]): Arbitrary<Ts[]>;
export { GenericTupleArbitrary, genericTuple };
