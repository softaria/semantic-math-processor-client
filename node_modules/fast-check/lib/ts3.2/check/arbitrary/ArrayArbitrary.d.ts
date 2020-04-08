import { Random } from '../../random/generator/Random';
import { Arbitrary } from './definition/Arbitrary';
import { ArbitraryWithShrink } from './definition/ArbitraryWithShrink';
import { Shrinkable } from './definition/Shrinkable';
/** @hidden */
declare class ArrayArbitrary<T> extends Arbitrary<T[]> {
    readonly arb: Arbitrary<T>;
    readonly minLength: number;
    readonly maxLength: number;
    readonly preFilter: (tab: Shrinkable<T>[]) => Shrinkable<T>[];
    readonly lengthArb: ArbitraryWithShrink<number>;
    constructor(arb: Arbitrary<T>, minLength: number, maxLength: number, preFilter?: (tab: Shrinkable<T>[]) => Shrinkable<T>[]);
    private static makeItCloneable;
    private wrapper;
    generate(mrng: Random): Shrinkable<T[]>;
    private shrinkImpl;
    withBias(freq: number): Arbitrary<T[]>;
}
/**
 * For arrays of values coming from `arb`
 * @param arb Arbitrary used to generate the values inside the array
 */
declare function array<T>(arb: Arbitrary<T>): Arbitrary<T[]>;
/**
 * For arrays of values coming from `arb` having an upper bound size
 * @param arb Arbitrary used to generate the values inside the array
 * @param maxLength Upper bound of the generated array size
 */
declare function array<T>(arb: Arbitrary<T>, maxLength: number): Arbitrary<T[]>;
/**
 * For arrays of values coming from `arb` having lower and upper bound size
 * @param arb Arbitrary used to generate the values inside the array
 * @param minLength Lower bound of the generated array size
 * @param maxLength Upper bound of the generated array size
 */
declare function array<T>(arb: Arbitrary<T>, minLength: number, maxLength: number): Arbitrary<T[]>;
export { array, ArrayArbitrary };
