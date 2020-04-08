"use strict";
exports.__esModule = true;
var symbols_1 = require("../../symbols");
var CommandsIterable = (function () {
    function CommandsIterable(commands, metadataForReplay) {
        this.commands = commands;
        this.metadataForReplay = metadataForReplay;
    }
    CommandsIterable.prototype[Symbol.iterator] = function () {
        return this.commands[Symbol.iterator]();
    };
    CommandsIterable.prototype[symbols_1.cloneMethod] = function () {
        return new CommandsIterable(this.commands.map(function (c) { return c.clone(); }), this.metadataForReplay);
    };
    CommandsIterable.prototype.toString = function () {
        var serializedCommands = this.commands
            .filter(function (c) { return c.hasRan; })
            .map(function (c) { return c.toString(); })
            .join(',');
        var metadata = this.metadataForReplay();
        return metadata.length !== 0 ? serializedCommands + " /*" + metadata + "*/" : serializedCommands;
    };
    return CommandsIterable;
}());
exports.CommandsIterable = CommandsIterable;
