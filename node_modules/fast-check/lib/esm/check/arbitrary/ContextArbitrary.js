import { cloneMethod } from '../symbols.js';
import { clonedConstant } from './ConstantArbitrary.js';
var ContextImplem = (function () {
    function ContextImplem() {
        this.receivedLogs = [];
    }
    ContextImplem.prototype.log = function (data) {
        this.receivedLogs.push(data);
    };
    ContextImplem.prototype.size = function () {
        return this.receivedLogs.length;
    };
    ContextImplem.prototype.toString = function () {
        return JSON.stringify({ logs: this.receivedLogs });
    };
    ContextImplem.prototype[cloneMethod] = function () {
        return new ContextImplem();
    };
    return ContextImplem;
}());
export var context = function () { return clonedConstant(new ContextImplem()); };
