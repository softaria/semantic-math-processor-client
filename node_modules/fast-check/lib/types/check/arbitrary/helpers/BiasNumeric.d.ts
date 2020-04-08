import { Arbitrary } from '../definition/Arbitrary';
/** @hidden */
declare type Numeric = number | any;
/** @hidden */
declare type NumericArbitrary<NType> = new (min: NType, max: NType) => Arbitrary<NType>;
/** @hidden */
export declare function biasNumeric<NType extends Numeric>(min: NType, max: NType, Ctor: NumericArbitrary<NType>, logLike: (n: NType) => NType): Arbitrary<NType>;
export {};
