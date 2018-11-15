'use strict';

/**
 * i.e. [a, b, c] => {a: 0, b: 1, c: 2}
 */
export function array2Enum(arr) {
    const res = {};
    for (let i = 0; i < arr.length; i++) {
        res[arr[i]] = i;
    }
    return res;
}
