<template>
    <div class="lacks-page">
        <lacks-panel></lacks-panel>
        <div>
            <lacks-table clsNames="lacks-left float" :items="items"></lacks-table>
            <div class="lacks-right float">
                <lacks-list v-for="(item, index) in RARITY_LIST" :style="{width: 100/RARITY_LIST.length + '%'}" clsNames="float"
                        :title="item.name" :color="item.color" :items="getItems(itemsFilter.series, itemsFilter.cls, item.name)"></lacks-list>
            </div>
        </div>
    </div>
</template>
<script>
'use strict';

import _ from 'lodash';
import LacksPanel from './lackspanel';
import LacksTable from './lackstable';
import LacksList from './lackslist';
import {SERIES_LIST, CLASS_LIST, RARITY_LIST} from '../common/hs';

export default {
    computed: {
        items() {
            return this.$store.state.lacks.items;
        },
        itemsFilter() {
            return this.$store.state.lacks.itemsFilter;
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
    },
    methods: {
        getItems(series, cls, rarity) {
            return _(this.items).filter(this.fieldFilter('series', series))
                    .filter(this.fieldFilter('cls', cls))
                    .filter(this.fieldFilter('rarity', rarity))
                    .sortBy([
                        (item) => SERIES_LIST.indexOf(item.series),
                        (item) => CLASS_LIST.concat(['Neutral']).indexOf(item.cls),
                        (item) => item.cost
                    ])
                    .value();
        },
        fieldFilter(key, value) {
            return (item) => {
                return value == 'Total' || item[key] == value;
            };
        }
    }
};

</script>
<style lang="less" scoped>
@import '../../less/flex.less';
.lacks-page {
    .flex-group-top(104px);
}
.lacks-left, .lacks-right {
    width: 50%;
}
.float {
    float: left;
    height: 100%;
}
</style>