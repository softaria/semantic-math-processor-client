import { Random } from '../../random/generator/Random';
import { IRawProperty } from './IRawProperty';
/** @hidden */
export declare class SkipAfterProperty<Ts, IsAsync extends boolean> implements IRawProperty<Ts, IsAsync> {
    readonly property: IRawProperty<Ts, IsAsync>;
    readonly getTime: () => number;
    readonly interruptExecution: boolean;
    private skipAfterTime;
    constructor(property: IRawProperty<Ts, IsAsync>, getTime: () => number, timeLimit: number, interruptExecution: boolean);
    isAsync: () => IsAsync;
    generate: (mrng: Random, runId?: number | undefined) => import("../../fast-check-default").Shrinkable<Ts, Ts>;
    run: (v: Ts) => any;
}
