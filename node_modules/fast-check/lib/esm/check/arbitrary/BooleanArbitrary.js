import { integer } from './IntegerArbitrary.js';
function boolean() {
    return integer(0, 1)
        .map(function (v) { return v === 1; })
        .noBias();
}
export { boolean };
