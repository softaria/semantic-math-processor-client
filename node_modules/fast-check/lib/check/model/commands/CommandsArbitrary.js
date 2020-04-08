"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var Stream_1 = require("../../../stream/Stream");
var Arbitrary_1 = require("../../arbitrary/definition/Arbitrary");
var Shrinkable_1 = require("../../arbitrary/definition/Shrinkable");
var IntegerArbitrary_1 = require("../../arbitrary/IntegerArbitrary");
var OneOfArbitrary_1 = require("../../arbitrary/OneOfArbitrary");
var ReplayPath_1 = require("../ReplayPath");
var CommandsIterable_1 = require("./CommandsIterable");
var CommandWrapper_1 = require("./CommandWrapper");
var LazyIterableIterator_1 = require("../../../stream/LazyIterableIterator");
var CommandsArbitrary = (function (_super) {
    tslib_1.__extends(CommandsArbitrary, _super);
    function CommandsArbitrary(commandArbs, maxCommands, sourceReplayPath, disableReplayLog) {
        var _this = _super.call(this) || this;
        _this.sourceReplayPath = sourceReplayPath;
        _this.disableReplayLog = disableReplayLog;
        _this.oneCommandArb = OneOfArbitrary_1.oneof.apply(void 0, tslib_1.__spread(commandArbs)).map(function (c) { return new CommandWrapper_1.CommandWrapper(c); });
        _this.lengthArb = IntegerArbitrary_1.nat(maxCommands);
        _this.replayPath = [];
        _this.replayPathPosition = 0;
        return _this;
    }
    CommandsArbitrary.prototype.metadataForReplay = function () {
        return this.disableReplayLog ? '' : "replayPath=" + JSON.stringify(ReplayPath_1.ReplayPath.stringify(this.replayPath));
    };
    CommandsArbitrary.prototype.wrapper = function (items, shrunkOnce) {
        var _this = this;
        return new Shrinkable_1.Shrinkable(new CommandsIterable_1.CommandsIterable(items.map(function (s) { return s.value_; }), function () { return _this.metadataForReplay(); }), function () {
            return _this.shrinkImpl(items, shrunkOnce).map(function (v) { return _this.wrapper(v, true); });
        });
    };
    CommandsArbitrary.prototype.generate = function (mrng) {
        var size = this.lengthArb.generate(mrng);
        var items = Array(size.value_);
        for (var idx = 0; idx !== size.value_; ++idx) {
            var item = this.oneCommandArb.generate(mrng);
            items[idx] = item;
        }
        this.replayPathPosition = 0;
        return this.wrapper(items, false);
    };
    CommandsArbitrary.prototype.filterOnExecution = function (itemsRaw) {
        var e_1, _a;
        var items = [];
        try {
            for (var itemsRaw_1 = tslib_1.__values(itemsRaw), itemsRaw_1_1 = itemsRaw_1.next(); !itemsRaw_1_1.done; itemsRaw_1_1 = itemsRaw_1.next()) {
                var c = itemsRaw_1_1.value;
                if (c.value_.hasRan) {
                    this.replayPath.push(true);
                    items.push(c);
                }
                else
                    this.replayPath.push(false);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (itemsRaw_1_1 && !itemsRaw_1_1.done && (_a = itemsRaw_1["return"])) _a.call(itemsRaw_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return items;
    };
    CommandsArbitrary.prototype.filterOnReplay = function (itemsRaw) {
        var _this = this;
        return itemsRaw.filter(function (c, idx) {
            var state = _this.replayPath[_this.replayPathPosition + idx];
            if (state === undefined)
                throw new Error("Too short replayPath");
            if (!state && c.value_.hasRan)
                throw new Error("Mismatch between replayPath and real execution");
            return state;
        });
    };
    CommandsArbitrary.prototype.filterForShrinkImpl = function (itemsRaw) {
        if (this.replayPathPosition === 0) {
            this.replayPath = this.sourceReplayPath !== null ? ReplayPath_1.ReplayPath.parse(this.sourceReplayPath) : [];
        }
        var items = this.replayPathPosition < this.replayPath.length
            ? this.filterOnReplay(itemsRaw)
            : this.filterOnExecution(itemsRaw);
        this.replayPathPosition += itemsRaw.length;
        return items;
    };
    CommandsArbitrary.prototype.shrinkImpl = function (itemsRaw, shrunkOnce) {
        var _this = this;
        var items = this.filterForShrinkImpl(itemsRaw);
        if (items.length === 0) {
            return Stream_1.Stream.nil();
        }
        var rootShrink = shrunkOnce
            ? Stream_1.Stream.nil()
            : new Stream_1.Stream([[]][Symbol.iterator]());
        var nextShrinks = [];
        var _loop_1 = function (numToKeep) {
            nextShrinks.push(LazyIterableIterator_1.makeLazy(function () {
                var size = _this.lengthArb.shrinkableFor(items.length - 1 - numToKeep, false);
                var fixedStart = items.slice(0, numToKeep);
                return size.shrink().map(function (l) { return fixedStart.concat(items.slice(items.length - (l.value + 1))); });
            }));
        };
        for (var numToKeep = 0; numToKeep !== items.length; ++numToKeep) {
            _loop_1(numToKeep);
        }
        var _loop_2 = function (itemAt) {
            nextShrinks.push(LazyIterableIterator_1.makeLazy(function () { return items[itemAt].shrink().map(function (v) { return items.slice(0, itemAt).concat([v], items.slice(itemAt + 1)); }); }));
        };
        for (var itemAt = 0; itemAt !== items.length; ++itemAt) {
            _loop_2(itemAt);
        }
        return rootShrink.join.apply(rootShrink, tslib_1.__spread(nextShrinks)).map(function (shrinkables) {
            return shrinkables.map(function (c) {
                return new Shrinkable_1.Shrinkable(c.value_.clone(), c.shrink);
            });
        });
    };
    return CommandsArbitrary;
}(Arbitrary_1.Arbitrary));
function commands(commandArbs, settings) {
    var config = settings == null ? {} : typeof settings === 'number' ? { maxCommands: settings } : settings;
    return new CommandsArbitrary(commandArbs, config.maxCommands != null ? config.maxCommands : 10, config.replayPath != null ? config.replayPath : null, !!config.disableReplayLog);
}
exports.commands = commands;
