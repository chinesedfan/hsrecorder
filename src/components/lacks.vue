<template>
    <div class="lacks-page">
        <lacks-panel></lacks-panel>
        <div>
            <lacks-table clsNames="lacks-left"></lacks-table>
            <div class="lacks-right">
                <lacks-list v-for="(q, index) in QUALITY_LIST" :style="{width: 100/QUALITY_LIST.length + '%'}" clsNames="lacks-list"
                        :title="q" :color="COLOR_LIST[index]" :cards="[]"></lacks-list>
            </div>
        </div>
    </div>
</template>
<script>
'use strict';

import LacksPanel from './lackspanel';
import LacksTable from './lackstable';
import LacksList from './lackslist';
import {QUALITY_LIST, COLOR_LIST} from '../common/hs';

export default {
    data() {
        return {
            QUALITY_LIST,
            COLOR_LIST
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