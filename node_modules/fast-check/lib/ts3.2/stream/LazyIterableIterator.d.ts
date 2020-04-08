/**
 * @internal
 * @hidden
 * Create an IterableIterator based on a function that will only be called once if needed
 * @param producer Function to instanciate the underlying IterableIterator
 */
export declare function makeLazy<T>(producer: () => IterableIterator<T>): IterableIterator<T>;
