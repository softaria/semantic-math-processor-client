import { Arbitrary } from './definition/Arbitrary';
/** Define an item to be passed to `scheduleSequence` */
export declare type SchedulerSequenceItem = {
    builder: () => Promise<any>;
    label: string;
} | (() => Promise<any>);
export interface SchedulerConstraints {
    /** Ensure that all scheduled tasks will be executed in the right context (for instance it can be the `act` of React) */
    act: (f: () => Promise<void>) => Promise<unknown>;
}
/**
 * Instance able to reschedule the ordering of promises
 * for a given app
 */
export interface Scheduler {
    /** Wrap a new task using the Scheduler */
    schedule: <T>(task: Promise<T>, label?: string) => Promise<T>;
    /** Automatically wrap function output using the Scheduler */
    scheduleFunction: <TArgs extends any[], T>(asyncFunction: (...args: TArgs) => Promise<T>) => (...args: TArgs) => Promise<T>;
    /**
     * Schedule a sequence of Promise to be executed sequencially.
     * Items within the sequence might be interleaved by other scheduled operations.
     *
     * Please note that whenever an item from the sequence has started,
     * the scheduler will wait until its end before moving to another scheduled task.
     *
     * A handle is returned by the function in order to monitor the state of the sequence.
     * Sequence will be marked:
     * - done if all the promises have been executed properly
     * - faulty if one of the promises within the sequence throws
     */
    scheduleSequence(sequenceBuilders: SchedulerSequenceItem[]): {
        done: boolean;
        faulty: boolean;
        task: Promise<{
            done: boolean;
            faulty: boolean;
        }>;
    };
    /**
     * Count of pending scheduled tasks
     */
    count(): number;
    /**
     * Wait one scheduled task to be executed
     * @throws Whenever there is no task scheduled
     */
    waitOne: () => Promise<void>;
    /**
     * Wait all scheduled tasks,
     * including the ones that might be created by one of the resolved task
     */
    waitAll: () => Promise<void>;
}
/**
 * For scheduler of promises
 */
export declare function scheduler(constraints?: SchedulerConstraints): Arbitrary<Scheduler>;
