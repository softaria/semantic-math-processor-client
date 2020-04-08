export var ObjectEntriesImpl = function (obj) {
    var ownProps = Object.keys(obj);
    var i = ownProps.length;
    var resArray = new Array(i);
    while (i--)
        resArray[i] = [ownProps[i], obj[ownProps[i]]];
    return resArray;
};
export var ObjectEntries = Object.entries ? Object.entries : ObjectEntriesImpl;
var repeatUpToLength = function (src, targetLength) {
    for (; targetLength > src.length; src += src)
        ;
    return src;
};
export var StringPadEndImpl = function (src, targetLength, padString) {
    targetLength = targetLength >> 0;
    if (padString === '' || src.length > targetLength)
        return String(src);
    targetLength = targetLength - src.length;
    padString = repeatUpToLength(typeof padString !== 'undefined' ? String(padString) : ' ', targetLength);
    return String(src) + padString.slice(0, targetLength);
};
export var StringPadStartImpl = function (src, targetLength, padString) {
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
export var StringPadEnd = wrapStringPad(String.prototype.padEnd) || StringPadEndImpl;
export var StringPadStart = wrapStringPad(String.prototype.padStart) || StringPadStartImpl;
export var StringFromCodePointLimitedImpl = function (codePoint) {
    if (codePoint < 0x10000)
        return String.fromCharCode(codePoint);
    codePoint -= 0x10000;
    return String.fromCharCode((codePoint >> 10) + 0xd800) + String.fromCharCode((codePoint % 0x400) + 0xdc00);
};
export var StringFromCodePointLimited = String.fromCodePoint ? String.fromCodePoint : StringFromCodePointLimitedImpl;
