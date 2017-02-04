'use strict';

import _ from 'lodash';
import {ARENA_UPDATE_ROWS} from '../mutation-types';

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
        }
    }
};
