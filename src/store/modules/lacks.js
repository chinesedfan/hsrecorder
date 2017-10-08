'use strict';

/**
 * @typedef {CardItem}
 * @property {String} id
 * @property {String} name
 * @property {Number} cls
 * @property {Number} rarity
 * @property {Number} cost
 * @property {String} series
 * @property {Number} targetCount
 * @property {Number} lackCount
 * @property {Number} pendingCount
 */

import _ from 'lodash';
import {LACKS_UPDATE_ROWS, LACKS_SELECT_CELL, LACKS_UPDATE_EDIT_MODE,
        LACKS_INCREASE_ITEM, LACKS_DECREASE_ITEM} from '../mutation-types';

export default {
    state: {
        /**
         * @type {CardItem[]}
         */
        items: [],
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
        [LACKS_UPDATE_ROWS](state, rows) {
            state.items = rows;
        },
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
                pendingCount: Math.min(_.isEmpty(targetItems) ? 1 : targetItems[0].pendingCount + 1, item.targetCount - item.lackCount)
            });
        },
        [LACKS_DECREASE_ITEM](state, item) {
            const targetItems = _.remove(state.editPendingList, (x) => x.id == item.id);
            state.editPendingList.push({
                ...item,
                pendingCount: Math.max(_.isEmpty(targetItems) ? -1 : targetItems[0].pendingCount - 1, -item.lackCount)
            });
        }
    }
};
