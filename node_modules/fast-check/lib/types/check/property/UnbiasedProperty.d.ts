import { Random } from '../../random/generator/Random';
import { IRawProperty } from './IRawProperty';
/** @hidden */
export declare class UnbiasedProperty<Ts, IsAsync extends boolean> implements IRawProperty<Ts, IsAsync> {
    readonly property: IRawProperty<Ts, IsAsync>;
    constructor(property: IRawProperty<Ts, IsAsync>);
    isAsync: () => IsAsync;
    generate: (mrng: Random, _runId?: number | undefined) => import("../../fast-check-default").Shrinkable<Ts, Ts>;
    run: (v: Ts) => (IsAsync extends true ? Promise<string | import("../precondition/PreconditionFailure").PreconditionFailure | null> : never) | (IsAsync extends false ? string | import("../precondition/PreconditionFailure").PreconditionFailure | null : never);
}
