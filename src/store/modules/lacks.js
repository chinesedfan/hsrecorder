'use strict';

/**
 * @typedef {CardItem}
 * @property {String} id
 * @property {String} name
 * @property {Number} cls
 * @property {Number} rarity
 * @property {Number} cost
 * @property {String} series
 * @property {Number} count
 */

import _ from 'lodash';
import {getClassByNumber, getRarityByNumber} from '../../common/hs';
import CardList from '../../../bin/cardlist';

const items = _.map(CardList, (item) => {
    item.cls = getClassByNumber(item.cls);
    item.rarity = getRarityByNumber(item.rarity);
    // FIXME: update with the real data
    item.count = 0;
    return item;
});

export default {
    state: {
        /**
         * @type {CardItem[]}
         */
        items
    }
};
