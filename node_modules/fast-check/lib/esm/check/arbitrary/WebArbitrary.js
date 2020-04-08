import { __read, __spread } from "tslib";
import { array } from './ArrayArbitrary.js';
import { constantFrom } from './ConstantArbitrary.js';
import { constant } from './ConstantArbitrary.js';
import { buildAlphaNumericPercentArb } from './helpers/SpecificCharacterRange.js';
import { domain, hostUserInfo } from './HostArbitrary.js';
import { nat } from './IntegerArbitrary.js';
import { ipV4, ipV4Extended, ipV6 } from './IpArbitrary.js';
import { oneof } from './OneOfArbitrary.js';
import { option } from './OptionArbitrary.js';
import { stringOf } from './StringArbitrary.js';
import { tuple } from './TupleArbitrary.js';
export function webAuthority(constraints) {
    var c = constraints || {};
    var hostnameArbs = [domain()]
        .concat(c.withIPv4 === true ? [ipV4()] : [])
        .concat(c.withIPv6 === true ? [ipV6().map(function (ip) { return "[" + ip + "]"; })] : [])
        .concat(c.withIPv4Extended === true ? [ipV4Extended()] : []);
    return tuple(c.withUserInfo === true ? option(hostUserInfo()) : constant(null), oneof.apply(void 0, __spread(hostnameArbs)), c.withPort === true ? option(nat(65535)) : constant(null)).map(function (_a) {
        var _b = __read(_a, 3), u = _b[0], h = _b[1], p = _b[2];
        return (u === null ? '' : u + "@") + h + (p === null ? '' : ":" + p);
    });
}
export function webSegment() {
    var others = ['-', '.', '_', '~', '!', '$', '&', "'", '(', ')', '*', '+', ',', ';', '=', ':', '@'];
    return stringOf(buildAlphaNumericPercentArb(others));
}
function uriQueryOrFragment() {
    var others = ['-', '.', '_', '~', '!', '$', '&', "'", '(', ')', '*', '+', ',', ';', '=', ':', '@', '/', '?'];
    return stringOf(buildAlphaNumericPercentArb(others));
}
export function webQueryParameters() {
    return uriQueryOrFragment();
}
export function webFragments() {
    return uriQueryOrFragment();
}
export function webUrl(constraints) {
    var c = constraints || {};
    var validSchemes = c.validSchemes || ['http', 'https'];
    var schemeArb = constantFrom.apply(void 0, __spread(validSchemes));
    var authorityArb = webAuthority(c.authoritySettings);
    var pathArb = array(webSegment()).map(function (p) { return p.map(function (v) { return "/" + v; }).join(''); });
    return tuple(schemeArb, authorityArb, pathArb, c.withQueryParameters === true ? option(webQueryParameters()) : constant(null), c.withFragments === true ? option(webFragments()) : constant(null)).map(function (_a) {
        var _b = __read(_a, 5), s = _b[0], a = _b[1], p = _b[2], q = _b[3], f = _b[4];
        return s + "://" + a + p + (q === null ? '' : "?" + q) + (f === null ? '' : "#" + f);
    });
}
