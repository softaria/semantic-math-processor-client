import { Arbitrary } from './definition/Arbitrary';
/**
 * For `value`
 * @param value The value to produce
 */
declare function constant<T>(value: T): Arbitrary<T>;
/**
 * For `value`
 * @param value The value to produce
 */
declare function clonedConstant<T>(value: T): Arbitrary<T>;
/**
 * For one `...values` values - all equiprobable
 *
 * **WARNING**: It expects at least one value, otherwise it should throw
 *
 * @param values Constant values to be produced (all values shrink to the first one)
 */
declare function constantFrom<T>(...values: T[]): Arbitrary<T>;
export { clonedConstant, constant, constantFrom };
