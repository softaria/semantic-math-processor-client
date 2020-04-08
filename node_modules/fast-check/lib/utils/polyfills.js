"use strict";
exports.__esModule = true;
exports.ObjectEntriesImpl = function (obj) {
    var ownProps = Object.keys(obj);
    var i = ownProps.length;
    var resArray = new Array(i);
    while (i--)
        resArray[i] = [ownProps[i], obj[ownProps[i]]];
    return resArray;
};
exports.ObjectEntries = Object.entries ? Object.entries : exports.ObjectEntriesImpl;
var repeatUpToLength = function (src, targetLength) {
    for (; targetLength > src.length; src += src)
        ;
    return src;
};
exports.StringPadEndImpl = function (src, targetLength, padString) {
    targetLength = targetLength >> 0;
    if (padString === '' || src.length > targetLength)
        return String(src);
    targetLength = targetLength - src.length;
    padString = repeatUpToLength(typeof padString !== 'undefined' ? String(padString) : ' ', targetLength);
    return String(src) + padString.slice(0, targetLength);
};
exports.StringPadStartImpl = function (src, targetLength, padString) {
    targetLength = targetLength >> 0;
    if (padString === '' || src.length > targetLength)
        return String(src);
    targetLength = targetLength - src.length;
    padString = repeatUpToLength(typeof padString !== 'undefined' ? String(padString) : ' ', targetLength);
    return padString.slice(0, targetLength) + String(src);
};
var wrapStringPad = function (method) {
    return (method &&
        (function (src, targetLength, padString) { return method.call(src, targetLength, padString); }));
};
exports.StringPadEnd = wrapStringPad(String.prototype.padEnd) || exports.StringPadEndImpl;
exports.StringPadStart = wrapStringPad(String.prototype.padStart) || exports.StringPadStartImpl;
exports.StringFromCodePointLimitedImpl = function (codePoint) {
    if (codePoint < 0x10000)
        return String.fromCharCode(codePoint);
    codePoint -= 0x10000;
    return String.fromCharCode((codePoint >> 10) + 0xd800) + String.fromCharCode((codePoint % 0x400) + 0xdc00);
};
exports.StringFromCodePointLimited = String.fromCodePoint ? String.fromCodePoint : exports.StringFromCodePointLimitedImpl;
