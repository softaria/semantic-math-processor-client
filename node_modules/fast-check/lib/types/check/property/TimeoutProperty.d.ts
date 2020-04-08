import { Random } from '../../random/generator/Random';
import { Shrinkable } from '../arbitrary/definition/Shrinkable';
import { IRawProperty } from './IRawProperty';
/** @hidden */
export declare class TimeoutProperty<Ts> implements IRawProperty<Ts, true> {
    readonly property: IRawProperty<Ts>;
    readonly timeMs: number;
    constructor(property: IRawProperty<Ts>, timeMs: number);
    isAsync: () => true;
    generate(mrng: Random, runId?: number): Shrinkable<Ts>;
    run(v: Ts): Promise<string | import("../precondition/PreconditionFailure").PreconditionFailure | null>;
}
