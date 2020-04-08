import { __values } from "tslib";
import { stream } from '../../../stream/Stream.js';
export function pathWalk(path, initialValues) {
    var e_1, _a;
    var values = stream(initialValues);
    var segments = path.split(':').map(function (text) { return +text; });
    if (segments.length === 0)
        return values;
    if (!segments.every(function (v) { return !Number.isNaN(v); })) {
        throw new Error("Unable to replay, got invalid path=" + path);
    }
    values = values.drop(segments[0]);
    try {
        for (var _b = __values(segments.slice(1)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var s = _c.value;
            var valueToShrink = values.getNthOrLast(0);
            if (valueToShrink == null) {
                throw new Error("Unable to replay, got wrong path=" + path);
            }
            values = valueToShrink.shrink().drop(s);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return values;
}
