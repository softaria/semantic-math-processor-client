import { Random } from '../../random/generator/Random';
import { Arbitrary } from './definition/Arbitrary';
import { Shrinkable } from './definition/Shrinkable';
/** @hidden */
export declare class LazyArbitrary extends Arbitrary<any> {
    readonly name: string;
    private static readonly MaxBiasLevels;
    private numBiasLevels;
    private lastBiasedArbitrary;
    underlying: Arbitrary<any> | null;
    constructor(name: string);
    generate(mrng: Random): Shrinkable<any>;
    withBias(freq: number): Arbitrary<any>;
}
/**
 * For mutually recursive types
 *
 * @example
 * ```typescript
 * const { tree } = fc.letrec(tie => ({
 *   tree: fc.oneof(tie('node'), tie('leaf'), tie('leaf')),
 *   node: fc.tuple(tie('tree'), tie('tree')),
 *   leaf: fc.nat()
 * })); // tree is 1 / 3 of node, 2 / 3 of leaf
 * ```
 *
 * @param builder Arbitraries builder based on themselves (through `tie`)
 */
export declare function letrec<T>(builder: (tie: (key: string) => Arbitrary<unknown>) => {
    [K in keyof T]: Arbitrary<T[K]>;
}): {
    [K in keyof T]: Arbitrary<T[K]>;
};
