'use strict';

/**
 * @typedef {CardItem}
 * @property {String} id
 * @property {String} name
 * @property {Number} cls
 * @property {Number} rarity
 * @property {Number} cost
 * @property {String} series
 * @property {Number} lackCount
 */

import _ from 'lodash';
import {getClassByNumber, getRarityByNumber} from '../../common/hs';
import CardList from '../../../bin/cardlist';
import {LACKS_SELECT_CELL, LACKS_UPDATE_EDIT_MODE, LACKS_INCREASE_ITEM, LACKS_DECREASE_ITEM} from '../mutation-types';

const items = _.map(CardList, (item) => {
    item.cls = getClassByNumber(item.cls);
    item.rarity = getRarityByNumber(item.rarity);
    // FIXME: update with the real data
    item.lackCount = 0;
    return item;
});

export default {
    state: {
        /**
         * @type {CardItem[]}
         */
        items,
        // filter
        itemsFilter: {
            series: 'Total',
            cls: 'Total'
        },
        // mode
        isEditMode: false,
        // pending list
        editPendingList: []
    },
    mutations: {
        [LACKS_SELECT_CELL](state, {filter}) {
            state.itemsFilter = filter;
            state.editPendingList = [];
        },
        [LACKS_UPDATE_EDIT_MODE](state, payload) {
            state.isEditMode = payload;
        },
        [LACKS_INCREASE_ITEM](state, item) {
            const targetItems = _.remove(state.editPendingList, (x) => x.id == item.id);
            state.editPendingList.push({
                ...item,
                lackCount: Math.min(_.isEmpty(targetItems) ? 1 : targetItems[0].lackCount + 1, 2)
            });
        },
        [LACKS_DECREASE_ITEM](state, item) {
            const targetItems = _.remove(state.editPendingList, (x) => x.id == item.id);
            if (_.isEmpty(targetItems) || targetItems[0].lackCount == 1) return;

            state.editPendingList.push({
                ...item,
                lackCount: targetItems[0].lackCount - 1
            });
        }
    }
};
