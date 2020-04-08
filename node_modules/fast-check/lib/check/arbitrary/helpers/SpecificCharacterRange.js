"use strict";
exports.__esModule = true;
var CharacterArbitrary_1 = require("../CharacterArbitrary");
var FrequencyArbitrary_1 = require("../FrequencyArbitrary");
var MapToConstantArbitrary_1 = require("../MapToConstantArbitrary");
var lowerCaseMapper = { num: 26, build: function (v) { return String.fromCharCode(v + 0x61); } };
var upperCaseMapper = { num: 26, build: function (v) { return String.fromCharCode(v + 0x41); } };
var numericMapper = { num: 10, build: function (v) { return String.fromCharCode(v + 0x30); } };
var percentCharArb = CharacterArbitrary_1.fullUnicode().map(function (c) {
    var encoded = encodeURIComponent(c);
    return c !== encoded ? encoded : "%" + c.charCodeAt(0).toString(16);
});
exports.buildLowerAlphaArb = function (others) {
    return MapToConstantArbitrary_1.mapToConstant(lowerCaseMapper, { num: others.length, build: function (v) { return others[v]; } });
};
exports.buildLowerAlphaNumericArb = function (others) {
    return MapToConstantArbitrary_1.mapToConstant(lowerCaseMapper, numericMapper, { num: others.length, build: function (v) { return others[v]; } });
};
exports.buildAlphaNumericArb = function (others) {
    return MapToConstantArbitrary_1.mapToConstant(lowerCaseMapper, upperCaseMapper, numericMapper, { num: others.length, build: function (v) { return others[v]; } });
};
exports.buildAlphaNumericPercentArb = function (others) {
    return FrequencyArbitrary_1.frequency({
        weight: 10,
        arbitrary: exports.buildAlphaNumericArb(others)
    }, {
        weight: 1,
        arbitrary: percentCharArb
    });
};
