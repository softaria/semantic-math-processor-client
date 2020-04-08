import { ICommand } from '../command/ICommand';
/** @hidden */
export declare class CommandWrapper<Model extends object, Real, RunResult, CheckAsync extends boolean> implements ICommand<Model, Real, RunResult, CheckAsync> {
    readonly cmd: ICommand<Model, Real, RunResult, CheckAsync>;
    hasRan: boolean;
    constructor(cmd: ICommand<Model, Real, RunResult, CheckAsync>);
    check(m: Readonly<Model>): CheckAsync extends false ? boolean : Promise<boolean>;
    run(m: Model, r: Real): RunResult;
    clone(): CommandWrapper<Model, Real, RunResult, CheckAsync>;
    toString(): string;
}
