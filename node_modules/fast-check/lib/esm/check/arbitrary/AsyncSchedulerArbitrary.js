import { __awaiter, __extends, __generator, __read, __spread } from "tslib";
import { cloneMethod } from '../symbols.js';
import { Arbitrary } from './definition/Arbitrary.js';
import { Shrinkable } from './definition/Shrinkable.js';
import { stringify } from '../../utils/stringify.js';
var SchedulerImplem = (function () {
    function SchedulerImplem(act, mrng) {
        this.act = act;
        this.mrng = mrng;
        this.lastTaskId = 0;
        this.sourceMrng = mrng.clone();
        this.scheduledTasks = [];
        this.triggeredTasksLogs = [];
    }
    SchedulerImplem.prototype.buildLog = function (taskId, meta, type, data) {
        return "[task#" + taskId + "] " + meta + " " + type + (data !== undefined ? " with value " + stringify(data) : '');
    };
    SchedulerImplem.prototype.log = function (taskId, meta, type, data) {
        this.triggeredTasksLogs.push(this.buildLog(taskId, meta, type, data));
    };
    SchedulerImplem.prototype.scheduleInternal = function (meta, task, thenTaskToBeAwaited) {
        var _this = this;
        var trigger = null;
        var taskId = ++this.lastTaskId;
        var scheduledPromise = new Promise(function (resolve, reject) {
            trigger = function () {
                (thenTaskToBeAwaited ? task.then(function () { return thenTaskToBeAwaited(); }) : task).then(function (data) {
                    _this.log(taskId, meta, 'resolved', data);
                    return resolve(data);
                }, function (err) {
                    _this.log(taskId, meta, 'rejected', err);
                    return reject(err);
                });
            };
        });
        this.scheduledTasks.push({
            original: task,
            scheduled: scheduledPromise,
            trigger: trigger,
            label: this.buildLog(taskId, meta, 'pending', undefined)
        });
        return scheduledPromise;
    };
    SchedulerImplem.prototype.schedule = function (task, label) {
        return this.scheduleInternal(label === undefined ? 'promise' : "promise::" + label, task);
    };
    SchedulerImplem.prototype.scheduleFunction = function (asyncFunction) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.scheduleInternal("function::" + asyncFunction.name + "(" + args.map(stringify).join(',') + ")", asyncFunction.apply(void 0, __spread(args)));
        };
    };
    SchedulerImplem.prototype.scheduleSequence = function (sequenceBuilders) {
        var _this = this;
        var status = { done: false, faulty: false };
        var dummyResolvedPromise = { then: function (f) { return f(); } };
        var resolveSequenceTask = function () { };
        var sequenceTask = new Promise(function (resolve) { return (resolveSequenceTask = resolve); });
        sequenceBuilders
            .reduce(function (previouslyScheduled, item) {
            var _a = __read(typeof item === 'function' ? [item, item.name] : [item.builder, item.label], 2), builder = _a[0], label = _a[1];
            return previouslyScheduled.then(function () {
                var scheduled = _this.scheduleInternal("sequence::" + label, dummyResolvedPromise, function () { return builder(); });
                scheduled["catch"](function () {
                    status.faulty = true;
                    resolveSequenceTask();
                });
                return scheduled;
            });
        }, dummyResolvedPromise)
            .then(function () {
            status.done = true;
            resolveSequenceTask();
        }, function () {
        });
        return Object.assign(status, {
            task: Promise.resolve(sequenceTask).then(function () {
                return { done: status.done, faulty: status.faulty };
            })
        });
    };
    SchedulerImplem.prototype.count = function () {
        return this.scheduledTasks.length;
    };
    SchedulerImplem.prototype.internalWaitOne = function () {
        return __awaiter(this, void 0, void 0, function () {
            var taskIndex, _a, scheduledTask, _err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.scheduledTasks.length === 0) {
                            throw new Error('No task scheduled');
                        }
                        taskIndex = this.mrng.nextInt(0, this.scheduledTasks.length - 1);
                        _a = __read(this.scheduledTasks.splice(taskIndex, 1), 1), scheduledTask = _a[0];
                        scheduledTask.trigger();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4, scheduledTask.scheduled];
                    case 2:
                        _b.sent();
                        return [3, 4];
                    case 3:
                        _err_1 = _b.sent();
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    SchedulerImplem.prototype.waitOne = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.act(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, this.internalWaitOne()];
                                case 1: return [2, _a.sent()];
                            }
                        }); }); })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    SchedulerImplem.prototype.waitAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.scheduledTasks.length > 0)) return [3, 2];
                        return [4, this.waitOne()];
                    case 1:
                        _a.sent();
                        return [3, 0];
                    case 2: return [2];
                }
            });
        });
    };
    SchedulerImplem.prototype.toString = function () {
        return ('Scheduler`\n' +
            this.triggeredTasksLogs
                .concat(this.scheduledTasks.map(function (t) { return t.label; }))
                .map(function (log) { return "-> " + log; })
                .join('\n') +
            '`');
    };
    SchedulerImplem.prototype[cloneMethod] = function () {
        return new SchedulerImplem(this.act, this.sourceMrng);
    };
    return SchedulerImplem;
}());
var SchedulerArbitrary = (function (_super) {
    __extends(SchedulerArbitrary, _super);
    function SchedulerArbitrary(act) {
        var _this = _super.call(this) || this;
        _this.act = act;
        return _this;
    }
    SchedulerArbitrary.prototype.generate = function (mrng) {
        return new Shrinkable(new SchedulerImplem(this.act, mrng.clone()));
    };
    return SchedulerArbitrary;
}(Arbitrary));
export function scheduler(constraints) {
    var _a = (constraints || {}).act, act = _a === void 0 ? function (f) { return f(); } : _a;
    return new SchedulerArbitrary(act);
}
