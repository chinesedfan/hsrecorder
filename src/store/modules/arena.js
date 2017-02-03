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
                    .map((rs) => rs.length).value();
        },
        // {wins: game count}
        countByWins(state) {
            return _(state.rows).groupBy((r) => r.wins)
                    .map((rs) => rs.length).value();
        },
        // {cls: total wins}
        winsByCls(state) {
            return _(state.rows).groupBy((r) => r.cls)
                    .map((rs) => _.sumBy(rs, (r) => r.wins)).value();
        },
        // [wins]
        wins(state) {
            return _(state.rows).map((r) => r.wins).value();
        },
        // total wins
        totalWins(state, getters) {
            return _.sum(getters.wins);
        },
        // total avg
        totalAvg(state, getters) {
            const wins = getters.wins;
            return _.isEmpty(wins) ? 0 : (_.sum(wins) / wins.length).toFixed(2);
        }
    },
    mutations: {
        [ARENA_UPDATE_ROWS](state, rows) {
            state.rows = rows;
        }
    }
};
