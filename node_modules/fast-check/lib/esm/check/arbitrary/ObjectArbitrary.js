import { __read, __spread } from "tslib";
import { stringify } from '../../utils/stringify.js';
import { array } from './ArrayArbitrary.js';
import { boolean } from './BooleanArbitrary.js';
import { constant } from './ConstantArbitrary.js';
import { dictionary, toObject } from './DictionaryArbitrary.js';
import { double } from './FloatingPointArbitrary.js';
import { frequency } from './FrequencyArbitrary.js';
import { integer } from './IntegerArbitrary.js';
import { memo } from './MemoArbitrary.js';
import { oneof } from './OneOfArbitrary.js';
import { set } from './SetArbitrary.js';
import { string, unicodeString } from './StringArbitrary.js';
import { tuple } from './TupleArbitrary.js';
var ObjectConstraints = (function () {
    function ObjectConstraints(key, values, maxDepth, maxKeys, withSet, withMap, withObjectString, withNullPrototype) {
        this.key = key;
        this.values = values;
        this.maxDepth = maxDepth;
        this.maxKeys = maxKeys;
        this.withSet = withSet;
        this.withMap = withMap;
        this.withObjectString = withObjectString;
        this.withNullPrototype = withNullPrototype;
    }
    ObjectConstraints.defaultValues = function () {
        return [
            boolean(),
            integer(),
            double(),
            string(),
            oneof(string(), constant(null), constant(undefined)),
            oneof(double(), constant(-0), constant(0), constant(Number.NaN), constant(Number.POSITIVE_INFINITY), constant(Number.NEGATIVE_INFINITY), constant(Number.EPSILON), constant(Number.MIN_VALUE), constant(Number.MAX_VALUE), constant(Number.MIN_SAFE_INTEGER), constant(Number.MAX_SAFE_INTEGER))
        ];
    };
    ObjectConstraints.boxArbitraries = function (arbs) {
        return arbs.map(function (arb) {
            return arb.map(function (v) {
                switch (typeof v) {
                    case 'boolean':
                        return new Boolean(v);
                    case 'number':
                        return new Number(v);
                    case 'string':
                        return new String(v);
                    default:
                        return v;
                }
            });
        });
    };
    ObjectConstraints.boxArbitrariesIfNeeded = function (arbs, boxEnabled) {
        return boxEnabled ? ObjectConstraints.boxArbitraries(arbs).concat(arbs) : arbs;
    };
    ObjectConstraints.from = function (settings) {
        function getOr(access, value) {
            return settings != null && access() != null ? access() : value;
        }
        return new ObjectConstraints(getOr(function () { return settings.key; }, string()), ObjectConstraints.boxArbitrariesIfNeeded(getOr(function () { return settings.values; }, ObjectConstraints.defaultValues()), getOr(function () { return settings.withBoxedValues; }, false)), getOr(function () { return settings.maxDepth; }, 2), getOr(function () { return settings.maxKeys; }, 5), getOr(function () { return settings.withSet; }, false), getOr(function () { return settings.withMap; }, false), getOr(function () { return settings.withObjectString; }, false), getOr(function () { return settings.withNullPrototype; }, false));
    };
    return ObjectConstraints;
}());
export { ObjectConstraints };
var anythingInternal = function (constraints) {
    var arbKeys = constraints.withObjectString
        ? memo(function (n) {
            return frequency({ arbitrary: constraints.key, weight: 10 }, { arbitrary: anythingArb(n).map(function (o) { return stringify(o); }), weight: 1 });
        })
        : memo(function () { return constraints.key; });
    var arbitrariesForBase = constraints.values;
    var maxDepth = constraints.maxDepth;
    var maxKeys = constraints.maxKeys;
    var entriesOf = function (keyArb, valueArb) {
        return set(tuple(keyArb, valueArb), 0, maxKeys, function (t1, t2) { return t1[0] === t2[0]; });
    };
    var mapOf = function (ka, va) { return entriesOf(ka, va).map(function (v) { return new Map(v); }); };
    var dictOf = function (ka, va) { return entriesOf(ka, va).map(function (v) { return toObject(v); }); };
    var baseArb = oneof.apply(void 0, __spread(arbitrariesForBase));
    var arrayBaseArb = oneof.apply(void 0, __spread(arbitrariesForBase.map(function (arb) { return array(arb, 0, maxKeys); })));
    var objectBaseArb = function (n) { return oneof.apply(void 0, __spread(arbitrariesForBase.map(function (arb) { return dictOf(arbKeys(n), arb); }))); };
    var setBaseArb = function () { return oneof.apply(void 0, __spread(arbitrariesForBase.map(function (arb) { return set(arb, 0, maxKeys).map(function (v) { return new Set(v); }); }))); };
    var mapBaseArb = function (n) { return oneof.apply(void 0, __spread(arbitrariesForBase.map(function (arb) { return mapOf(arbKeys(n), arb); }))); };
    var arrayArb = memo(function (n) { return oneof(arrayBaseArb, array(anythingArb(n), 0, maxKeys)); });
    var setArb = memo(function (n) { return oneof(setBaseArb(), set(anythingArb(n), 0, maxKeys).map(function (v) { return new Set(v); })); });
    var mapArb = memo(function (n) {
        return oneof(mapBaseArb(n), oneof(mapOf(arbKeys(n), anythingArb(n)), mapOf(anythingArb(n), anythingArb(n))));
    });
    var objectArb = memo(function (n) { return oneof(objectBaseArb(n), dictOf(arbKeys(n), anythingArb(n))); });
    var anythingArb = memo(function (n) {
        if (n <= 0)
            return oneof(baseArb);
        return oneof.apply(void 0, __spread([baseArb,
            arrayArb(),
            objectArb()], (constraints.withMap ? [mapArb()] : []), (constraints.withSet ? [setArb()] : []), (constraints.withObjectString ? [anythingArb().map(function (o) { return stringify(o); })] : []), (constraints.withNullPrototype ? [objectArb().map(function (o) { return Object.assign(Object.create(null), o); })] : [])));
    });
    return anythingArb(maxDepth);
};
var objectInternal = function (constraints) {
    return dictionary(constraints.key, anythingInternal(constraints));
};
function anything(settings) {
    return anythingInternal(ObjectConstraints.from(settings));
}
function object(settings) {
    return objectInternal(ObjectConstraints.from(settings));
}
function jsonSettings(stringArbitrary, maxDepth) {
    var key = stringArbitrary;
    var values = [boolean(), integer(), double(), stringArbitrary, constant(null)];
    return maxDepth != null ? { key: key, values: values, maxDepth: maxDepth } : { key: key, values: values };
}
function jsonObject(maxDepth) {
    return anything(jsonSettings(string(), maxDepth));
}
function unicodeJsonObject(maxDepth) {
    return anything(jsonSettings(unicodeString(), maxDepth));
}
function json(maxDepth) {
    var arb = maxDepth != null ? jsonObject(maxDepth) : jsonObject();
    return arb.map(JSON.stringify);
}
function unicodeJson(maxDepth) {
    var arb = maxDepth != null ? unicodeJsonObject(maxDepth) : unicodeJsonObject();
    return arb.map(JSON.stringify);
}
export { anything, object, jsonObject, unicodeJsonObject, json, unicodeJson };
