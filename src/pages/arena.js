'use strict';

import Vue from 'vue';
import Vuex from 'vuex';
import Arena from '../components/arena';
import store from '../store';

Vue.use(Vuex);

new Vue({
    el: '#vue-container',
    store: new Vuex.Store(store),
    components: {
        app: Arena
    }
});
