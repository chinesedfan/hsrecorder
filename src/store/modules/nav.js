'use strict';

import {NAV_SELECT_INDEX} from '../mutation-types';

export default {
    namespaced: true,
    state: {
        selectedIndex: 0
    },
    mutations: {
        [NAV_SELECT_INDEX](state, index) {
            state.selectedIndex = index;
        }
    }
};
