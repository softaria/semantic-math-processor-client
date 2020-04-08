"use strict";
exports.__esModule = true;
var LazyIterableIterator = (function () {
    function LazyIterableIterator(producer) {
        this.producer = producer;
    }
    LazyIterableIterator.prototype[Symbol.iterator] = function () {
        if (this.it === undefined) {
            this.it = this.producer();
        }
        return this.it;
    };
    LazyIterableIterator.prototype.next = function () {
        if (this.it === undefined) {
            this.it = this.producer();
        }
        return this.it.next();
    };
    return LazyIterableIterator;
}());
function makeLazy(producer) {
    return new LazyIterableIterator(producer);
}
exports.makeLazy = makeLazy;
