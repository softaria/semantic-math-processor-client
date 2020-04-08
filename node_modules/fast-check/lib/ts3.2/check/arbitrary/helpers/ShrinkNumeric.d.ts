import { Stream } from '../../../stream/Stream';
/** @hidden */
export declare function shrinkNumber(min: number, max: number, current: number, shrunkOnce: boolean): Stream<number>;
/** @hidden */
export declare function shrinkBigInt(min: bigint, max: bigint, current: bigint, shrunkOnce: boolean): Stream<bigint>;
