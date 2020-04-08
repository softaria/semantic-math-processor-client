import { Shrinkable } from '../../arbitrary/definition/Shrinkable';
/** @hidden */
export declare function pathWalk<Ts>(path: string, initialValues: IterableIterator<Shrinkable<Ts>>): IterableIterator<Shrinkable<Ts>>;
