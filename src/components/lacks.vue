<template>
    <div class="lacks-page">
        <lacks-panel :is-edit-mode="isEditMode"></lacks-panel>
        <div>
            <lacks-table clsNames="lacks-left float" :is-edit-mode="isEditMode" :items="items"></lacks-table>
            <div class="lacks-right float">
                <lacks-list v-for="(item, index) in RARITY_LIST" :style="{width: 100/RARITY_LIST.length + '%'}" clsNames="float"
                        :is-edit-mode="isEditMode"
                        :title="item.name" :color="item.color" :items="getItems(itemsFilter.series, itemsFilter.cls, item.name)"></lacks-list>
            </div>
        </div>
    </div>
</template>
<script>
'use strict';

import _ from 'lodash';
import {mapMutations} from 'vuex';
import LacksPanel from './lackspanel';
import LacksTable from './lackstable';
import LacksList from './lackslist';
import * as types from '../store/mutation-types';
import * as LacksService from '../service/lacks';
import {SERIES_LIST, CLASS_LIST, RARITY_LIST,
        getClassByNumber, getRarityByNumber} from '../common/hs';
import CardList from '../../bin/cardlist';

export default {
    computed: {
        isEditMode() {
            return this.$store.state.lacks.isEditMode;
        },
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
    mounted() {
        // for cache
        this.cardMap = _(CardList).groupBy('id')
                .mapValues((g) => g[0])
                .mapValues((item) => {
                    return {
                        ...item,
                        cls: getClassByNumber(item.cls),
                        rarity: getRarityByNumber(item.rarity),
                        targetCount: getRarityByNumber(item.rarity) === 'Legendary' ? 1 : 2,
                        lackCount: 0
                    };
                })
                .value();
    },
    methods: {
        ...mapMutations({
            updateRows: types.LACKS_UPDATE_ROWS
        }),
        getItems(series, cls, rarity) {
            return _(this.items).filter(this.fieldFilter('series', series))
                    .filter(this.fieldFilter('cls', cls))
                    .filter(this.fieldFilter('rarity', rarity))
                    .filter((item) => this.isEditMode || item.lackCount)
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
    },
    beforeRouteEnter(to, from, next) {
        LacksService.loadLacksData().then((rows) => {
            next((vm) => {
                const map = _.groupBy(rows, 'id');
                const items = _.map(CardList, (item) => {
                    return {
                        ...vm.cardMap[item.id],
                        ...(map[item.id] ? map[item.id][0] : {})
                    }
                });
                vm.updateRows(items);
            });
        });
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