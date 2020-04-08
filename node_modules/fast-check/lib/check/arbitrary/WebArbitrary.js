"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var ArrayArbitrary_1 = require("./ArrayArbitrary");
var ConstantArbitrary_1 = require("./ConstantArbitrary");
var ConstantArbitrary_2 = require("./ConstantArbitrary");
var SpecificCharacterRange_1 = require("./helpers/SpecificCharacterRange");
var HostArbitrary_1 = require("./HostArbitrary");
var IntegerArbitrary_1 = require("./IntegerArbitrary");
var IpArbitrary_1 = require("./IpArbitrary");
var OneOfArbitrary_1 = require("./OneOfArbitrary");
var OptionArbitrary_1 = require("./OptionArbitrary");
var StringArbitrary_1 = require("./StringArbitrary");
var TupleArbitrary_1 = require("./TupleArbitrary");
function webAuthority(constraints) {
    var c = constraints || {};
    var hostnameArbs = [HostArbitrary_1.domain()]
        .concat(c.withIPv4 === true ? [IpArbitrary_1.ipV4()] : [])
        .concat(c.withIPv6 === true ? [IpArbitrary_1.ipV6().map(function (ip) { return "[" + ip + "]"; })] : [])
        .concat(c.withIPv4Extended === true ? [IpArbitrary_1.ipV4Extended()] : []);
    return TupleArbitrary_1.tuple(c.withUserInfo === true ? OptionArbitrary_1.option(HostArbitrary_1.hostUserInfo()) : ConstantArbitrary_2.constant(null), OneOfArbitrary_1.oneof.apply(void 0, tslib_1.__spread(hostnameArbs)), c.withPort === true ? OptionArbitrary_1.option(IntegerArbitrary_1.nat(65535)) : ConstantArbitrary_2.constant(null)).map(function (_a) {
        var _b = tslib_1.__read(_a, 3), u = _b[0], h = _b[1], p = _b[2];
        return (u === null ? '' : u + "@") + h + (p === null ? '' : ":" + p);
    });
}
exports.webAuthority = webAuthority;
function webSegment() {
    var others = ['-', '.', '_', '~', '!', '$', '&', "'", '(', ')', '*', '+', ',', ';', '=', ':', '@'];
    return StringArbitrary_1.stringOf(SpecificCharacterRange_1.buildAlphaNumericPercentArb(others));
}
exports.webSegment = webSegment;
function uriQueryOrFragment() {
    var others = ['-', '.', '_', '~', '!', '$', '&', "'", '(', ')', '*', '+', ',', ';', '=', ':', '@', '/', '?'];
    return StringArbitrary_1.stringOf(SpecificCharacterRange_1.buildAlphaNumericPercentArb(others));
}
function webQueryParameters() {
    return uriQueryOrFragment();
}
exports.webQueryParameters = webQueryParameters;
function webFragments() {
    return uriQueryOrFragment();
}
exports.webFragments = webFragments;
function webUrl(constraints) {
    var c = constraints || {};
    var validSchemes = c.validSchemes || ['http', 'https'];
    var schemeArb = ConstantArbitrary_1.constantFrom.apply(void 0, tslib_1.__spread(validSchemes));
    var authorityArb = webAuthority(c.authoritySettings);
    var pathArb = ArrayArbitrary_1.array(webSegment()).map(function (p) { return p.map(function (v) { return "/" + v; }).join(''); });
    return TupleArbitrary_1.tuple(schemeArb, authorityArb, pathArb, c.withQueryParameters === true ? OptionArbitrary_1.option(webQueryParameters()) : ConstantArbitrary_2.constant(null), c.withFragments === true ? OptionArbitrary_1.option(webFragments()) : ConstantArbitrary_2.constant(null)).map(function (_a) {
        var _b = tslib_1.__read(_a, 5), s = _b[0], a = _b[1], p = _b[2], q = _b[3], f = _b[4];
        return s + "://" + a + p + (q === null ? '' : "?" + q) + (f === null ? '' : "#" + f);
    });
}
exports.webUrl = webUrl;
