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
import {LACKS_UPDATE_ROWS, LACKS_SELECT_CELL, LACKS_UPDATE_EDIT_MODE, LACKS_UPDATE_EDIT_MSG,
        LACKS_INCREASE_ITEM, LACKS_DECREASE_ITEM, LACKS_SUBMIT_PENDING} from '../mutation-types';
import * as LacksService from '../../service/lacks';

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
        // msg
        editMessage: '',
        // pending list
        editPendingList: []
    },
    actions: {
        [LACKS_SUBMIT_PENDING](context) {
            const state = context.state;
            const insertRows = _(state.editPendingList)
                    .filter((item) => item.pendingCount > 0)
                    .map((item) => {
                        const ret = {
                            card_id: item.id,
                            card_name: item.name,
                            card_quality: item.rarity
                        };
                        return item.pendingCount == 1 ? ret : [ret, ret];
                    })
                    .flatten()
                    .value();
            const deleteIds = _(state.editPendingList)
                    .filter((item) => item.pendingCount < 0)
                    .map((item) => (item.pendingCount == -1 ? item.id : [item.id, item.id]))
                    .flatten()
                    .values()
                    .value();
            const totalSqls = insertRows.length + deleteIds.length;

            let count = 0;
            LacksService.updateInBatch(insertRows, deleteIds, () => {
                count++;
                context.commit(LACKS_UPDATE_EDIT_MSG, `submited ${count}/${totalSqls}`);
            }, (err) => {
                context.commit(LACKS_UPDATE_EDIT_MSG, err.message);
            }).catch(() => {
                // ignore
            }).then(() => {
                context.commit(LACKS_SUBMIT_PENDING);
            });
        }
    },
    mutations: {
        [LACKS_UPDATE_ROWS](state, rows) {
            state.items = rows;
        },
        [LACKS_SELECT_CELL](state, {filter}) {
            state.itemsFilter = filter;
            state.editPendingList = []; // clean after changed filter
        },
        [LACKS_UPDATE_EDIT_MODE](state, payload) {
            state.isEditMode = payload;
        },
        [LACKS_UPDATE_EDIT_MSG](state, payload) {
            state.editMessage = payload;
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
        },
        [LACKS_SUBMIT_PENDING](state) {
            _.each(state.editPendingList, (item) => {
                if (!item.pendingCount) return;

                const index = _.findIndex(state.items, (x) => x.id == item.id);
                const targetItem = state.items[index];
                state.items.splice(index, 1, {
                    ...targetItem,
                    lackCount: targetItem.lackCount + item.pendingCount
                });
            });
            state.editPendingList = []; // clean after submited
        }
    }
};
