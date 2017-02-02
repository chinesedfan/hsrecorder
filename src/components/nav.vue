<template>
    <ul class="nav nav-tabs">
        <li v-for="(item, index) in items" :class="{ active: index == selectedIndex }"
            @click="() => { onItemClicked(index); }"><a>{{ item }}</a></li>
    </ul>
</template>
<script type="text/javascript">
'use strict';

import {mapState, mapMutations} from 'vuex';
import {NAV_SELECT_INDEX} from '../store/mutation-types';

export default {
    props: {
        items: Array
    },
    computed: {
        ...mapState('nav', {
            selectedIndex: (state) => state.selectedIndex
        })
    },
    methods: {
        ...mapMutations('nav', {
            onItemClicked: NAV_SELECT_INDEX
        })
    }
};

</script>
<style lang="less">
    
</style>