import { Arbitrary } from './definition/Arbitrary';
/** @hidden */
declare function toObject<T>(items: [string, T][]): {
    [key: string]: T;
};
/**
 * For dictionaries with keys produced by `keyArb` and values from `valueArb`
 * @param keyArb Arbitrary used to generate the keys of the object
 * @param valueArb Arbitrary used to generate the values of the object
 */
declare function dictionary<T>(keyArb: Arbitrary<string>, valueArb: Arbitrary<T>): Arbitrary<{
    [key: string]: T;
}>;
export { toObject, dictionary };
