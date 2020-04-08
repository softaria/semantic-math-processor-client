import { __read } from "tslib";
var ReplayPath = (function () {
    function ReplayPath() {
    }
    ReplayPath.parse = function (replayPathStr) {
        var _a = __read(replayPathStr.split(':'), 2), serializedCount = _a[0], serializedChanges = _a[1];
        var counts = this.parseCounts(serializedCount);
        var changes = this.parseChanges(serializedChanges);
        return this.parseOccurences(counts, changes);
    };
    ReplayPath.stringify = function (replayPath) {
        var occurences = this.countOccurences(replayPath);
        var serializedCount = this.stringifyCounts(occurences);
        var serializedChanges = this.stringifyChanges(occurences);
        return serializedCount + ":" + serializedChanges;
    };
    ReplayPath.intToB64 = function (n) {
        if (n < 26)
            return String.fromCharCode(n + 65);
        if (n < 52)
            return String.fromCharCode(n + 97 - 26);
        if (n < 62)
            return String.fromCharCode(n + 48 - 52);
        return String.fromCharCode(n === 62 ? 43 : 47);
    };
    ReplayPath.b64ToInt = function (c) {
        if (c >= 'a')
            return c.charCodeAt(0) - 97 + 26;
        if (c >= 'A')
            return c.charCodeAt(0) - 65;
        if (c >= '0')
            return c.charCodeAt(0) - 48 + 52;
        return c === '+' ? 62 : 63;
    };
    ReplayPath.countOccurences = function (replayPath) {
        return replayPath.reduce(function (counts, cur) {
            if (counts.length === 0 || counts[counts.length - 1].count === 64 || counts[counts.length - 1].value !== cur)
                counts.push({ value: cur, count: 1 });
            else
                counts[counts.length - 1].count += 1;
            return counts;
        }, []);
    };
    ReplayPath.parseOccurences = function (counts, changes) {
        var replayPath = [];
        for (var idx = 0; idx !== counts.length; ++idx) {
            var count = counts[idx];
            var value = changes[idx];
            for (var num = 0; num !== count; ++num)
                replayPath.push(value);
        }
        return replayPath;
    };
    ReplayPath.stringifyChanges = function (occurences) {
        var serializedChanges = '';
        for (var idx = 0; idx < occurences.length; idx += 6) {
            var changesInt = occurences
                .slice(idx, idx + 6)
                .reduceRight(function (prev, cur) { return prev * 2 + (cur.value ? 1 : 0); }, 0);
            serializedChanges += this.intToB64(changesInt);
        }
        return serializedChanges;
    };
    ReplayPath.parseChanges = function (serializedChanges) {
        var _this = this;
        var changesInt = serializedChanges.split('').map(function (c) { return _this.b64ToInt(c); });
        var changes = [];
        for (var idx = 0; idx !== changesInt.length; ++idx) {
            var current = changesInt[idx];
            for (var n = 0; n !== 6; ++n, current >>= 1) {
                changes.push(current % 2 === 1);
            }
        }
        return changes;
    };
    ReplayPath.stringifyCounts = function (occurences) {
        var _this = this;
        return occurences.map(function (_a) {
            var count = _a.count;
            return _this.intToB64(count - 1);
        }).join('');
    };
    ReplayPath.parseCounts = function (serializedCount) {
        var _this = this;
        return serializedCount.split('').map(function (c) { return _this.b64ToInt(c) + 1; });
    };
    return ReplayPath;
}());
export { ReplayPath };
