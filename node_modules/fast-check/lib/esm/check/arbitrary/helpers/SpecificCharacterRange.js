import { fullUnicode } from '../CharacterArbitrary.js';
import { frequency } from '../FrequencyArbitrary.js';
import { mapToConstant } from '../MapToConstantArbitrary.js';
var lowerCaseMapper = { num: 26, build: function (v) { return String.fromCharCode(v + 0x61); } };
var upperCaseMapper = { num: 26, build: function (v) { return String.fromCharCode(v + 0x41); } };
var numericMapper = { num: 10, build: function (v) { return String.fromCharCode(v + 0x30); } };
var percentCharArb = fullUnicode().map(function (c) {
    var encoded = encodeURIComponent(c);
    return c !== encoded ? encoded : "%" + c.charCodeAt(0).toString(16);
});
export var buildLowerAlphaArb = function (others) {
    return mapToConstant(lowerCaseMapper, { num: others.length, build: function (v) { return others[v]; } });
};
export var buildLowerAlphaNumericArb = function (others) {
    return mapToConstant(lowerCaseMapper, numericMapper, { num: others.length, build: function (v) { return others[v]; } });
};
export var buildAlphaNumericArb = function (others) {
    return mapToConstant(lowerCaseMapper, upperCaseMapper, numericMapper, { num: others.length, build: function (v) { return others[v]; } });
};
export var buildAlphaNumericPercentArb = function (others) {
    return frequency({
        weight: 10,
        arbitrary: buildAlphaNumericArb(others)
    }, {
        weight: 1,
        arbitrary: percentCharArb
    });
};
