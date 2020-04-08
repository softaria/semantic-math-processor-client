import { RandomGenerator } from 'pure-rand';
import { Parameters } from './Parameters';
import { VerbosityLevel } from './VerbosityLevel';
/**
 * @hidden
 *
 * Configuration extracted from incoming Parameters
 *
 * It handles and set the default settings that will be used by runners.
 */
export declare class QualifiedParameters<T> {
    seed: number;
    randomType: (seed: number) => RandomGenerator;
    numRuns: number;
    maxSkipsPerRun: number;
    timeout: number | null;
    path: string;
    logger: (v: string) => void;
    unbiased: boolean;
    verbose: VerbosityLevel;
    examples: T[];
    endOnFailure: boolean;
    skipAllAfterTimeLimit: number | null;
    interruptAfterTimeLimit: number | null;
    markInterruptAsFailure: boolean;
    constructor(op?: Parameters<T>);
    private static readSeed;
    private static readRandomType;
    private static readNumRuns;
    private static readVerbose;
    private static readBoolean;
    private static readOrDefault;
    /**
     * Extract a runner configuration from Parameters
     * @param p Incoming Parameters
     */
    static read<T>(op?: Parameters<T>): QualifiedParameters<T>;
}
