import { ArbitraryWithShrink } from './definition/ArbitraryWithShrink';
/**
 * For signed any of n bits
 *
 * Generated values will be between -2^(n-1) (included) and 2^(n-1) (excluded)
 *
 * @param n Maximal number of bits of the generated any
 */
declare function bigIntN(n: number): ArbitraryWithShrink<any>;
/**
 * For unsigned any of n bits
 *
 * Generated values will be between 0 (included) and 2^n (excluded)
 *
 * @param n Maximal number of bits of the generated any
 */
declare function bigUintN(n: number): ArbitraryWithShrink<any>;
/**
 * For any
 */
declare function bigInt(): ArbitraryWithShrink<any>;
/**
 * For any between min (included) and max (included)
 *
 * @param min Lower bound for the generated integers (eg.: 0n, BigInt(Number.MIN_SAFE_INTEGER))
 * @param max Upper bound for the generated integers (eg.: 2147483647n, BigInt(Number.MAX_SAFE_INTEGER))
 */
declare function bigInt(min: any, max: any): ArbitraryWithShrink<any>;
/**
 * For positive any
 */
declare function bigUint(): ArbitraryWithShrink<any>;
/**
 * For positive any between 0 (included) and max (included)
 * @param max Upper bound for the generated any
 */
declare function bigUint(max: any): ArbitraryWithShrink<any>;
export { bigIntN, bigUintN, bigInt, bigUint };
