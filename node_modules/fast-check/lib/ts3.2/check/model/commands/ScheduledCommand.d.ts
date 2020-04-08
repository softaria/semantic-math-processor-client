import { ICommand } from '../command/ICommand';
import { AsyncCommand } from '../command/AsyncCommand';
import { Scheduler } from '../../arbitrary/AsyncSchedulerArbitrary';
import { CommandsIterable } from './CommandsIterable';
/** @hidden */
export declare class ScheduledCommand<Model extends object, Real, RunResult, CheckAsync extends boolean> implements AsyncCommand<Model, Real, true> {
    readonly s: Scheduler;
    readonly cmd: ICommand<Model, Real, RunResult, CheckAsync>;
    constructor(s: Scheduler, cmd: ICommand<Model, Real, RunResult, CheckAsync>);
    check(m: Readonly<Model>): Promise<boolean>;
    run(m: Model, r: Real): Promise<void>;
}
/** @hidden */
export declare const scheduleCommands: <Model extends object, Real, CheckAsync extends boolean>(s: Scheduler, cmds: Iterable<AsyncCommand<Model, Real, CheckAsync>> | CommandsIterable<Model, Real, Promise<void>, CheckAsync>) => Iterable<AsyncCommand<Model, Real, true>>;
