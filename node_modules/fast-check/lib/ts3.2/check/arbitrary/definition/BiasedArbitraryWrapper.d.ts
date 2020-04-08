import { Arbitrary } from './Arbitrary';
/**
 * @hidden
 *
 * Helper function automatically choosing between the biased and unbiased versions of an Arbitrary.
 * This helper has been introduced in order to provide higher performances when building custom biased arbitraries
 */
export declare function biasWrapper<T, TSourceArbitrary extends Arbitrary<T>>(freq: number, arb: TSourceArbitrary, biasedArbBuilder: (unbiased: TSourceArbitrary) => Arbitrary<T>): Arbitrary<T>;
