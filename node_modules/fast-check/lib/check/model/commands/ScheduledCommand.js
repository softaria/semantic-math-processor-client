"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var ScheduledCommand = (function () {
    function ScheduledCommand(s, cmd) {
        this.s = s;
        this.cmd = cmd;
    }
    ScheduledCommand.prototype.check = function (m) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error, checkPassed, status;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = null;
                        checkPassed = false;
                        return [4, this.s.scheduleSequence([
                                {
                                    label: "check@" + this.cmd.toString(),
                                    builder: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                        var err_1;
                                        return tslib_1.__generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 2, , 3]);
                                                    return [4, Promise.resolve(this.cmd.check(m))];
                                                case 1:
                                                    checkPassed = _a.sent();
                                                    return [3, 3];
                                                case 2:
                                                    err_1 = _a.sent();
                                                    error = err_1;
                                                    throw err_1;
                                                case 3: return [2];
                                            }
                                        });
                                    }); }
                                }
                            ]).task];
                    case 1:
                        status = _a.sent();
                        if (status.faulty) {
                            throw error;
                        }
                        return [2, checkPassed];
                }
            });
        });
    };
    ScheduledCommand.prototype.run = function (m, r) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error, status;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = null;
                        return [4, this.s.scheduleSequence([
                                {
                                    label: "run@" + this.cmd.toString(),
                                    builder: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                        var err_2;
                                        return tslib_1.__generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 2, , 3]);
                                                    return [4, this.cmd.run(m, r)];
                                                case 1:
                                                    _a.sent();
                                                    return [3, 3];
                                                case 2:
                                                    err_2 = _a.sent();
                                                    error = err_2;
                                                    throw err_2;
                                                case 3: return [2];
                                            }
                                        });
                                    }); }
                                }
                            ]).task];
                    case 1:
                        status = _a.sent();
                        if (status.faulty) {
                            throw error;
                        }
                        return [2];
                }
            });
        });
    };
    return ScheduledCommand;
}());
exports.ScheduledCommand = ScheduledCommand;
exports.scheduleCommands = function (s, cmds) {
    var cmds_1, cmds_1_1, cmd, e_1_1;
    var e_1, _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, 6, 7]);
                cmds_1 = tslib_1.__values(cmds), cmds_1_1 = cmds_1.next();
                _b.label = 1;
            case 1:
                if (!!cmds_1_1.done) return [3, 4];
                cmd = cmds_1_1.value;
                return [4, new ScheduledCommand(s, cmd)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                cmds_1_1 = cmds_1.next();
                return [3, 1];
            case 4: return [3, 7];
            case 5:
                e_1_1 = _b.sent();
                e_1 = { error: e_1_1 };
                return [3, 7];
            case 6:
                try {
                    if (cmds_1_1 && !cmds_1_1.done && (_a = cmds_1["return"])) _a.call(cmds_1);
                }
                finally { if (e_1) throw e_1.error; }
                return [7];
            case 7: return [2];
        }
    });
};
