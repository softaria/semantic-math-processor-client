import { cloneMethod, hasCloneMethod } from '../../symbols.js';
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
        if (hasCloneMethod(this.cmd))
            return new CommandWrapper(this.cmd[cloneMethod]());
        return new CommandWrapper(this.cmd);
    };
    CommandWrapper.prototype.toString = function () {
        return this.cmd.toString();
    };
    return CommandWrapper;
}());
export { CommandWrapper };
