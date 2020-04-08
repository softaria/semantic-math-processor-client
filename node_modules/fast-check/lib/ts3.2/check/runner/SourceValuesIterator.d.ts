/**
 * @hidden
 * Try to extract maxInitialIterations non-skipped values
 * with a maximal number of remainingSkips skipped values
 * from initialValues source
 */
export declare class SourceValuesIterator<Ts> implements IterableIterator<Ts> {
    readonly initialValues: IterableIterator<() => Ts>;
    private maxInitialIterations;
    private remainingSkips;
    constructor(initialValues: IterableIterator<() => Ts>, maxInitialIterations: number, remainingSkips: number);
    [Symbol.iterator](): IterableIterator<Ts>;
    next(value?: any): IteratorResult<Ts>;
    skippedOne(): void;
}
