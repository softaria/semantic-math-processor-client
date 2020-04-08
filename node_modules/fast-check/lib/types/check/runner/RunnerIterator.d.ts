import { Shrinkable } from '../arbitrary/definition/Shrinkable';
import { PreconditionFailure } from '../precondition/PreconditionFailure';
import { VerbosityLevel } from './configuration/VerbosityLevel';
import { RunExecution } from './reporter/RunExecution';
import { SourceValuesIterator } from './SourceValuesIterator';
/**
 * @hidden
 * Responsible for the iteration logic
 *
 * Workflow:
 * 1- Call to `next` gives back the value to test
 * 2- Call to `handleResult` takes into account the execution status
 * 3- Back to 1
 */
export declare class RunnerIterator<Ts> implements IterableIterator<Ts> {
    readonly sourceValues: SourceValuesIterator<Shrinkable<Ts>>;
    runExecution: RunExecution<Ts>;
    private currentIdx;
    private currentShrinkable;
    private nextValues;
    constructor(sourceValues: SourceValuesIterator<Shrinkable<Ts>>, verbose: VerbosityLevel, interruptedAsFailure: boolean);
    [Symbol.iterator](): IterableIterator<Ts>;
    next(value?: any): IteratorResult<Ts>;
    handleResult(result: PreconditionFailure | string | null): void;
}
