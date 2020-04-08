import * as prand from 'pure-rand';
import { Shrinkable } from '../arbitrary/definition/Shrinkable';
import { IRawProperty } from '../property/IRawProperty';
/** @hidden */
export declare function toss<Ts>(generator: IRawProperty<Ts>, seed: number, random: (seed: number) => prand.RandomGenerator, examples: Ts[]): IterableIterator<() => Shrinkable<Ts>>;
