import { Random } from '../../random/generator/Random';
import { Arbitrary } from './definition/Arbitrary';
import { Shrinkable } from './definition/Shrinkable';
/** @hidden */
export declare class MemoArbitrary<T> extends Arbitrary<T> {
    readonly underlying: Arbitrary<T>;
    private lastFreq;
    private lastBiased;
    constructor(underlying: Arbitrary<T>);
    generate(mrng: Random): Shrinkable<T>;
    withBias(freq: number): Arbitrary<T>;
}
/**
 * Output type for {@link memo}
 */
export declare type Memo<T> = (maxDepth?: number) => Arbitrary<T>;
/**
 * For mutually recursive types
 *
 * @example
 * ```typescript
 * // tree is 1 / 3 of node, 2 / 3 of leaf
 * const tree: fc.Memo<Tree> = fc.memo(n => fc.oneof(node(n), leaf(), leaf()));
 * const node: fc.Memo<Tree> = fc.memo(n => {
 *   if (n <= 1) return fc.record({ left: leaf(), right: leaf() });
 *   return fc.record({ left: tree(), right: tree() }); // tree() is equivalent to tree(n-1)
 * });
 * const leaf = fc.nat;
 * ```
 *
 * @param builder Arbitrary builder taken the maximal depth allowed as input (parameter `n`)
 */
export declare const memo: <T>(builder: (maxDepth: number) => Arbitrary<T>) => Memo<T>;
