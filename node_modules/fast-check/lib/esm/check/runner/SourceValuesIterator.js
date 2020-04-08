var SourceValuesIterator = (function () {
    function SourceValuesIterator(initialValues, maxInitialIterations, remainingSkips) {
        this.initialValues = initialValues;
        this.maxInitialIterations = maxInitialIterations;
        this.remainingSkips = remainingSkips;
    }
    SourceValuesIterator.prototype[Symbol.iterator] = function () {
        return this;
    };
    SourceValuesIterator.prototype.next = function (value) {
        if (--this.maxInitialIterations !== -1 && this.remainingSkips >= 0) {
            var n = this.initialValues.next();
            if (!n.done)
                return { value: n.value(), done: false };
        }
        return { value: value, done: true };
    };
    SourceValuesIterator.prototype.skippedOne = function () {
        --this.remainingSkips;
        ++this.maxInitialIterations;
    };
    return SourceValuesIterator;
}());
export { SourceValuesIterator };
