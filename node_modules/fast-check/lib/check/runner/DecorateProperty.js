"use strict";
exports.__esModule = true;
var SkipAfterProperty_1 = require("../property/SkipAfterProperty");
var TimeoutProperty_1 = require("../property/TimeoutProperty");
var UnbiasedProperty_1 = require("../property/UnbiasedProperty");
function decorateProperty(rawProperty, qParams) {
    var prop = rawProperty;
    if (rawProperty.isAsync() && qParams.timeout != null)
        prop = new TimeoutProperty_1.TimeoutProperty(prop, qParams.timeout);
    if (qParams.unbiased === true)
        prop = new UnbiasedProperty_1.UnbiasedProperty(prop);
    if (qParams.skipAllAfterTimeLimit != null)
        prop = new SkipAfterProperty_1.SkipAfterProperty(prop, Date.now, qParams.skipAllAfterTimeLimit, false);
    if (qParams.interruptAfterTimeLimit != null)
        prop = new SkipAfterProperty_1.SkipAfterProperty(prop, Date.now, qParams.interruptAfterTimeLimit, true);
    return prop;
}
exports.decorateProperty = decorateProperty;
