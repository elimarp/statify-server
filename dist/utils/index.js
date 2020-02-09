"use strict";Object.defineProperty(exports, "__esModule", {value: true});const sortObjectArray = (objectArray, comparerParam, order = 'ASC') => {
    if (order.toUpperCase() === 'DESC') {
        return objectArray.sort((a, b) => {
            return b[comparerParam] - a[comparerParam];
        });
    }
    return objectArray.sort((a, b) => {
        return a[comparerParam] - b[comparerParam];
    });
}

exports. default = { sortObjectArray };