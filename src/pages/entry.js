'use strict';

import '../../less/main';

import * as Vue from 'vue';
import Vuex, {mapState} from 'vuex';
import * as VueRouter from 'vue-router';

import Nav from '../components/nav';
import Arena from '../components/arena';
import Lacks from '../components/lacks';
import Export from '../components/export';

import '../service';
import store from '../store';

const app = Vue.createApp({
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

app.use(Vuex.createStore(store));
app.use(VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        {path: '/', redirect: '/arena'},
        {path: '/arena', component: Arena},
        {path: '/lacks', component: Lacks},
        {path: '/export', component: Export}
    ]
}));

app.mount('#vue-container');
