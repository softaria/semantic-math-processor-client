export var runIdToFrequency = function (runId) { return 2 + Math.floor(Math.log(runId + 1) / Math.log(10)); };
