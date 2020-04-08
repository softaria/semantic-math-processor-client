import { Parameters } from './Parameters';
export declare type GlobalParameters = Pick<Parameters, Exclude<keyof Parameters, 'path' | 'examples'>>;
/**
 * Define global parameters that will be used by all the runners
 *
 * ```typescript
 * fc.configureGlobal({ numRuns: 10 });
 * //...
 * fc.assert(
 *   fc.property(
 *     fc.nat(), fc.nat(),
 *     (a, b) => a + b === b + a
 *   ), { seed: 42 }
 * ) // equivalent to { numRuns: 10, seed: 42 }
 * ```
 *
 * @param parameters Global parameters
 */
export declare const configureGlobal: (parameters: Pick<Parameters<void>, "seed" | "randomType" | "numRuns" | "maxSkipsPerRun" | "timeout" | "skipAllAfterTimeLimit" | "interruptAfterTimeLimit" | "markInterruptAsFailure" | "logger" | "unbiased" | "verbose" | "endOnFailure">) => void;
/**
 * Read global parameters that will be used by runners
 */
export declare const readConfigureGlobal: () => Pick<Parameters<void>, "seed" | "randomType" | "numRuns" | "maxSkipsPerRun" | "timeout" | "skipAllAfterTimeLimit" | "interruptAfterTimeLimit" | "markInterruptAsFailure" | "logger" | "unbiased" | "verbose" | "endOnFailure"> | undefined;
/**
 * Reset global parameters
 */
export declare const resetConfigureGlobal: () => void;
