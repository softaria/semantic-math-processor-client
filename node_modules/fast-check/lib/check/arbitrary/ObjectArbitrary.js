"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var stringify_1 = require("../../utils/stringify");
var ArrayArbitrary_1 = require("./ArrayArbitrary");
var BooleanArbitrary_1 = require("./BooleanArbitrary");
var ConstantArbitrary_1 = require("./ConstantArbitrary");
var DictionaryArbitrary_1 = require("./DictionaryArbitrary");
var FloatingPointArbitrary_1 = require("./FloatingPointArbitrary");
var FrequencyArbitrary_1 = require("./FrequencyArbitrary");
var IntegerArbitrary_1 = require("./IntegerArbitrary");
var MemoArbitrary_1 = require("./MemoArbitrary");
var OneOfArbitrary_1 = require("./OneOfArbitrary");
var SetArbitrary_1 = require("./SetArbitrary");
var StringArbitrary_1 = require("./StringArbitrary");
var TupleArbitrary_1 = require("./TupleArbitrary");
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
            BooleanArbitrary_1.boolean(),
            IntegerArbitrary_1.integer(),
            FloatingPointArbitrary_1.double(),
            StringArbitrary_1.string(),
            OneOfArbitrary_1.oneof(StringArbitrary_1.string(), ConstantArbitrary_1.constant(null), ConstantArbitrary_1.constant(undefined)),
            OneOfArbitrary_1.oneof(FloatingPointArbitrary_1.double(), ConstantArbitrary_1.constant(-0), ConstantArbitrary_1.constant(0), ConstantArbitrary_1.constant(Number.NaN), ConstantArbitrary_1.constant(Number.POSITIVE_INFINITY), ConstantArbitrary_1.constant(Number.NEGATIVE_INFINITY), ConstantArbitrary_1.constant(Number.EPSILON), ConstantArbitrary_1.constant(Number.MIN_VALUE), ConstantArbitrary_1.constant(Number.MAX_VALUE), ConstantArbitrary_1.constant(Number.MIN_SAFE_INTEGER), ConstantArbitrary_1.constant(Number.MAX_SAFE_INTEGER))
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
        return new ObjectConstraints(getOr(function () { return settings.key; }, StringArbitrary_1.string()), ObjectConstraints.boxArbitrariesIfNeeded(getOr(function () { return settings.values; }, ObjectConstraints.defaultValues()), getOr(function () { return settings.withBoxedValues; }, false)), getOr(function () { return settings.maxDepth; }, 2), getOr(function () { return settings.maxKeys; }, 5), getOr(function () { return settings.withSet; }, false), getOr(function () { return settings.withMap; }, false), getOr(function () { return settings.withObjectString; }, false), getOr(function () { return settings.withNullPrototype; }, false));
    };
    return ObjectConstraints;
}());
exports.ObjectConstraints = ObjectConstraints;
var anythingInternal = function (constraints) {
    var arbKeys = constraints.withObjectString
        ? MemoArbitrary_1.memo(function (n) {
            return FrequencyArbitrary_1.frequency({ arbitrary: constraints.key, weight: 10 }, { arbitrary: anythingArb(n).map(function (o) { return stringify_1.stringify(o); }), weight: 1 });
        })
        : MemoArbitrary_1.memo(function () { return constraints.key; });
    var arbitrariesForBase = constraints.values;
    var maxDepth = constraints.maxDepth;
    var maxKeys = constraints.maxKeys;
    var entriesOf = function (keyArb, valueArb) {
        return SetArbitrary_1.set(TupleArbitrary_1.tuple(keyArb, valueArb), 0, maxKeys, function (t1, t2) { return t1[0] === t2[0]; });
    };
    var mapOf = function (ka, va) { return entriesOf(ka, va).map(function (v) { return new Map(v); }); };
    var dictOf = function (ka, va) { return entriesOf(ka, va).map(function (v) { return DictionaryArbitrary_1.toObject(v); }); };
    var baseArb = OneOfArbitrary_1.oneof.apply(void 0, tslib_1.__spread(arbitrariesForBase));
    var arrayBaseArb = OneOfArbitrary_1.oneof.apply(void 0, tslib_1.__spread(arbitrariesForBase.map(function (arb) { return ArrayArbitrary_1.array(arb, 0, maxKeys); })));
    var objectBaseArb = function (n) { return OneOfArbitrary_1.oneof.apply(void 0, tslib_1.__spread(arbitrariesForBase.map(function (arb) { return dictOf(arbKeys(n), arb); }))); };
    var setBaseArb = function () { return OneOfArbitrary_1.oneof.apply(void 0, tslib_1.__spread(arbitrariesForBase.map(function (arb) { return SetArbitrary_1.set(arb, 0, maxKeys).map(function (v) { return new Set(v); }); }))); };
    var mapBaseArb = function (n) { return OneOfArbitrary_1.oneof.apply(void 0, tslib_1.__spread(arbitrariesForBase.map(function (arb) { return mapOf(arbKeys(n), arb); }))); };
    var arrayArb = MemoArbitrary_1.memo(function (n) { return OneOfArbitrary_1.oneof(arrayBaseArb, ArrayArbitrary_1.array(anythingArb(n), 0, maxKeys)); });
    var setArb = MemoArbitrary_1.memo(function (n) { return OneOfArbitrary_1.oneof(setBaseArb(), SetArbitrary_1.set(anythingArb(n), 0, maxKeys).map(function (v) { return new Set(v); })); });
    var mapArb = MemoArbitrary_1.memo(function (n) {
        return OneOfArbitrary_1.oneof(mapBaseArb(n), OneOfArbitrary_1.oneof(mapOf(arbKeys(n), anythingArb(n)), mapOf(anythingArb(n), anythingArb(n))));
    });
    var objectArb = MemoArbitrary_1.memo(function (n) { return OneOfArbitrary_1.oneof(objectBaseArb(n), dictOf(arbKeys(n), anythingArb(n))); });
    var anythingArb = MemoArbitrary_1.memo(function (n) {
        if (n <= 0)
            return OneOfArbitrary_1.oneof(baseArb);
        return OneOfArbitrary_1.oneof.apply(void 0, tslib_1.__spread([baseArb,
            arrayArb(),
            objectArb()], (constraints.withMap ? [mapArb()] : []), (constraints.withSet ? [setArb()] : []), (constraints.withObjectString ? [anythingArb().map(function (o) { return stringify_1.stringify(o); })] : []), (constraints.withNullPrototype ? [objectArb().map(function (o) { return Object.assign(Object.create(null), o); })] : [])));
    });
    return anythingArb(maxDepth);
};
var objectInternal = function (constraints) {
    return DictionaryArbitrary_1.dictionary(constraints.key, anythingInternal(constraints));
};
function anything(settings) {
    return anythingInternal(ObjectConstraints.from(settings));
}
exports.anything = anything;
function object(settings) {
    return objectInternal(ObjectConstraints.from(settings));
}
exports.object = object;
function jsonSettings(stringArbitrary, maxDepth) {
    var key = stringArbitrary;
    var values = [BooleanArbitrary_1.boolean(), IntegerArbitrary_1.integer(), FloatingPointArbitrary_1.double(), stringArbitrary, ConstantArbitrary_1.constant(null)];
    return maxDepth != null ? { key: key, values: values, maxDepth: maxDepth } : { key: key, values: values };
}
function jsonObject(maxDepth) {
    return anything(jsonSettings(StringArbitrary_1.string(), maxDepth));
}
exports.jsonObject = jsonObject;
function unicodeJsonObject(maxDepth) {
    return anything(jsonSettings(StringArbitrary_1.unicodeString(), maxDepth));
}
exports.unicodeJsonObject = unicodeJsonObject;
function json(maxDepth) {
    var arb = maxDepth != null ? jsonObject(maxDepth) : jsonObject();
    return arb.map(JSON.stringify);
}
exports.json = json;
function unicodeJson(maxDepth) {
    var arb = maxDepth != null ? unicodeJsonObject(maxDepth) : unicodeJsonObject();
    return arb.map(JSON.stringify);
}
exports.unicodeJson = unicodeJson;
