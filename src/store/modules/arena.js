'use strict';

import _ from 'lodash';
import {ARENA_UPDATE_ROWS, ARENA_INSERT_ROW, ARENA_DELETE_ROW} from '../mutation-types';
import * as ArenaService from '../../service/arena';

/**
 * @typedef {ArenaRow}
 * @property {Number} id
 * @property {String} day
 * @property {String} cls
 * @property {Number} wins
 */

export default {
    state: {
        /**
         * @type {ArenaRow[]}
         */
        rows: []
    },
    getters: {
        // {cls: game count}
        countByCls(state) {
            return _(state.rows).groupBy((r) => r.cls)
                    .mapValues((rs) => rs.length);
        },
        // {wins: game count}
        countByWins(state) {
            return _(state.rows).groupBy((r) => r.wins)
                    .mapValues((rs) => rs.length);
        },
        // {cls: total wins}
        winsByCls(state) {
            return _(state.rows).groupBy((r) => r.cls)
                    .mapValues((rs) => _.sumBy(rs, (r) => r.wins));
        },
        // [wins]
        wins(state) {
            return _(state.rows).map((r) => r.wins);
        },
        // total wins
        totalWins(state, getters) {
            return getters.wins.sum();
        },
        // total avg
        totalAvg(state, getters) {
            const wins = getters.wins;
            const len = wins.value().length;
            return len ? (wins.sum() / len).toFixed(2) : 0;
        }
    },
    mutations: {
        [ARENA_UPDATE_ROWS](state, rows) {
            state.rows = rows;
        },
        [ARENA_INSERT_ROW](state, row) {
            state.rows.push(row);
        },
        [ARENA_DELETE_ROW](state, id) {
            const index = _.findIndex(state.rows, (r) => r.id == id);
            state.rows.splice(index, 1);
        }
    },
    actions: {
        [ARENA_INSERT_ROW]({commit}, row) {
            ArenaService.insertArenaRow(row).then(() => {
                commit(ARENA_INSERT_ROW, row);
            });
        },
        [ARENA_DELETE_ROW]({commit}, id) {
            ArenaService.deleteArenaRow(id).then(() => {
                commit(ARENA_DELETE_ROW, id);
            });
        }
    }
};
