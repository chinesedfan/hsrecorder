<template>
    <div class="lacks-page">
        <lacks-panel></lacks-panel>
        <div>
            <lacks-table clsNames="lacks-left" :items="items"></lacks-table>
            <div class="lacks-right">
                <lacks-list v-for="(item, index) in RARITY_LIST" :style="{width: 100/RARITY_LIST.length + '%'}" clsNames="lacks-list"
                        :title="item.name" :color="item.color" :cards="[]"></lacks-list>
            </div>
        </div>
    </div>
</template>
<script>
'use strict';

import LacksPanel from './lackspanel';
import LacksTable from './lackstable';
import LacksList from './lackslist';
import {RARITY_LIST} from '../common/hs';

export default {
    computed: {
        items() {
            return this.$store.state.lacks.items;
        }
    },
    data() {
        return {
            RARITY_LIST
        };
    },
    components: {
        'lacks-panel': LacksPanel,
        'lacks-table': LacksTable,
        'lacks-list': LacksList
    }
};

</script>
<style lang="less" scoped>
@import '../../less/flex.less';
.lacks-page {
    .flex-group-top(74px);
}
.lacks-left, .lacks-right {
    float: left;
    width: 50%;
    height: 100%;
}
.lacks-list {
    float: left;
    height: 100%;
}
</style>