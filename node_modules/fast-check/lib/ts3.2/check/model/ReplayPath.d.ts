/** @hidden */
export declare class ReplayPath {
    /** Parse a serialized replayPath */
    static parse(replayPathStr: string): boolean[];
    /** Stringify a replayPath */
    static stringify(replayPath: boolean[]): string;
    /** Number to Base64 value */
    private static intToB64;
    /** Base64 value to number */
    private static b64ToInt;
    /**
     * Divide an incoming replayPath into an array of {value, count}
     * with count is the number of consecutive occurences of value (with a max set to 64)
     *
     * Above 64, another {value, count} is created
     */
    private static countOccurences;
    /**
     * Serialize an array of {value, count} back to its replayPath
     */
    private static parseOccurences;
    /**
     * Stringify the switch from true to false of occurences
     *
     * {value: 0}, {value: 1}, {value: 1}, {value: 0}
     * will be stringified as: 6 = (1 * 0) + (2 * 1) + (4 * 1) + (8 * 0)
     *
     * {value: 0}, {value: 1}, {value: 1}, {value: 0}, {value: 1}, {value: 0}, {value: 1}, {value: 0}
     * will be stringified as: 22, 1 [only 6 values encoded in one number]
     */
    private static stringifyChanges;
    /**
     * Parse switch of value
     */
    private static parseChanges;
    /**
     * Stringify counts of occurences
     */
    private static stringifyCounts;
    /**
     * Parse counts
     */
    private static parseCounts;
}
