'use strict';

import '../../less/main';

import Vue from 'vue';
import Vuex, {mapState} from 'vuex';
import VueRouter from 'vue-router';

import Nav from '../components/nav';
import Arena from '../components/arena';
import Packs from '../components/packs';
import Lacks from '../components/lacks';

import store from '../store';

Vue.use(Vuex);
Vue.use(VueRouter);

new Vue({
    el: '#vue-container',
    store: new Vuex.Store(store),
    router: new VueRouter({
        routes: [
            {path: '/', redirect: '/arena'},
            {path: '/arena', component: Arena},
            {path: '/packs', component: Packs},
            {path: '/lacks', component: Lacks}
        ]
    }),
    components: {
        'hsr-nav': Nav
    },
    computed: {
        ...mapState({
            navItems: (state) => state.nav.items,
            navIndex: (state) => state.nav.index
        })
    }
});
