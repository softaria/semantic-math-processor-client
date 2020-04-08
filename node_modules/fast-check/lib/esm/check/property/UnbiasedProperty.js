var UnbiasedProperty = (function () {
    function UnbiasedProperty(property) {
        var _this = this;
        this.property = property;
        this.isAsync = function () { return _this.property.isAsync(); };
        this.generate = function (mrng, _runId) { return _this.property.generate(mrng); };
        this.run = function (v) { return _this.property.run(v); };
    }
    return UnbiasedProperty;
}());
export { UnbiasedProperty };
