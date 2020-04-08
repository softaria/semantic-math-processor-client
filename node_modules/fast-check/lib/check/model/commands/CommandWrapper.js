"use strict";
exports.__esModule = true;
var symbols_1 = require("../../symbols");
var CommandWrapper = (function () {
    function CommandWrapper(cmd) {
        this.cmd = cmd;
        this.hasRan = false;
    }
    CommandWrapper.prototype.check = function (m) {
        return this.cmd.check(m);
    };
    CommandWrapper.prototype.run = function (m, r) {
        this.hasRan = true;
        return this.cmd.run(m, r);
    };
    CommandWrapper.prototype.clone = function () {
        if (symbols_1.hasCloneMethod(this.cmd))
            return new CommandWrapper(this.cmd[symbols_1.cloneMethod]());
        return new CommandWrapper(this.cmd);
    };
    CommandWrapper.prototype.toString = function () {
        return this.cmd.toString();
    };
    return CommandWrapper;
}());
exports.CommandWrapper = CommandWrapper;
