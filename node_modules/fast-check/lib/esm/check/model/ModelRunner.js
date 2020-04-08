import { __awaiter, __generator, __values } from "tslib";
import { scheduleCommands } from './commands/ScheduledCommand.js';
var genericModelRun = function (s, cmds, initialValue, runCmd, then) {
    return s.then(function (o) {
        var e_1, _a;
        var model = o.model, real = o.real;
        var state = initialValue;
        var _loop_1 = function (c) {
            state = then(state, function () {
                return runCmd(c, model, real);
            });
        };
        try {
            for (var cmds_1 = __values(cmds), cmds_1_1 = cmds_1.next(); !cmds_1_1.done; cmds_1_1 = cmds_1.next()) {
                var c = cmds_1_1.value;
                _loop_1(c);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (cmds_1_1 && !cmds_1_1.done && (_a = cmds_1["return"])) _a.call(cmds_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return state;
    });
};
var internalModelRun = function (s, cmds) {
    var then = function (p, c) { return c(); };
    var setupProducer = {
        then: function (fun) {
            fun(s());
            return undefined;
        }
    };
    var runSync = function (cmd, m, r) {
        if (cmd.check(m))
            cmd.run(m, r);
        return undefined;
    };
    return genericModelRun(setupProducer, cmds, undefined, runSync, then);
};
var isAsyncSetup = function (s) {
    return typeof s.then === 'function';
};
var internalAsyncModelRun = function (s, cmds, defaultPromise) {
    if (defaultPromise === void 0) { defaultPromise = Promise.resolve(); }
    return __awaiter(void 0, void 0, void 0, function () {
        var then, setupProducer, runAsync;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    then = function (p, c) { return p.then(c); };
                    setupProducer = {
                        then: function (fun) {
                            var out = s();
                            if (isAsyncSetup(out))
                                return out.then(fun);
                            else
                                return fun(out);
                        }
                    };
                    runAsync = function (cmd, m, r) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, cmd.check(m)];
                                case 1:
                                    if (!_a.sent()) return [3, 3];
                                    return [4, cmd.run(m, r)];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [2];
                            }
                        });
                    }); };
                    return [4, genericModelRun(setupProducer, cmds, defaultPromise, runAsync, then)];
                case 1: return [2, _a.sent()];
            }
        });
    });
};
export var modelRun = function (s, cmds) {
    internalModelRun(s, cmds);
};
export var asyncModelRun = function (s, cmds) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, internalAsyncModelRun(s, cmds)];
            case 1:
                _a.sent();
                return [2];
        }
    });
}); };
export var scheduledModelRun = function (scheduler, s, cmds) { return __awaiter(void 0, void 0, void 0, function () {
    var scheduledCommands, out;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                scheduledCommands = scheduleCommands(scheduler, cmds);
                out = internalAsyncModelRun(s, scheduledCommands, scheduler.schedule(Promise.resolve(), 'startModel'));
                return [4, scheduler.waitAll()];
            case 1:
                _a.sent();
                return [4, out];
            case 2:
                _a.sent();
                return [2];
        }
    });
}); };
