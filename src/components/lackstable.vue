<template>
    <div class="lacks-table" :class="clsNames">
        <table><tbody>
            <tr>
                <th></th>
                <th v-for="cls in clsList">{{ cls }}</th>
            </tr>
            <tr v-for="item in rowItems" v-show="item.rarity == 'Total' || item.series == expandedSeries"
                    :class="{tline: item.rarity == 'Total' || item.rarity == 'Common'}">
                <td class="bold" @click="onSeriesClicked(item.series)">{{ item.rarity == 'Total' ? item.series : '' }}</td>
                <td v-for="cls in clsList" :class="getTdCls(item.series, cls, item.rarity)" :style="{color: item.color}"
                        @click="onCellClicked({series: item.series, cls: cls})">{{ getTdText(item.series, cls, item.rarity) }}</td>
            </tr>
        </tbody></table>
    </div>
</template>
<script>
'use strict';

import _ from 'lodash';
import {SERIES_LIST, CLASS_LIST, RARITY_LIST} from '../common/hs';
import * as types from '../store/mutation-types';

export default {
    props: {
        clsNames: String,
        items: Array
    },
    computed: {
        // {series: {cls: {rarity: {target, owned}}}}
        counts() {
            const counts = {};
            const total = 'Total';
            const initialItem = {
                target: 0,
                owned: 0
            };
            _.each(this.items, (item) => {
                const addItem = {
                    target: item.targetCount,
                    owned: item.targetCount - item.lackCount
                };
                
                this.updateCounts(counts, item.series, item.cls, item.rarity, addItem);

                this.updateCounts(counts, item.series, item.cls, total, addItem);
                this.updateCounts(counts, item.series, total, item.rarity, addItem);
                this.updateCounts(counts, total, item.cls, item.rarity, addItem);

                this.updateCounts(counts, item.series, total, total, addItem);
                this.updateCounts(counts, total, total, item.rarity, addItem);
                this.updateCounts(counts, total, item.cls, total, addItem);

                this.updateCounts(counts, total, total, total, addItem);
            });

            return counts;
        },
        // [{series, rarity, color}]
        rowItems() {
            return _(this.seriesList).map((series) => {
                return _.map(this.rarityList, (rarityItem) => {
                    return {
                        series,
                        rarity: rarityItem.name,
                        color: rarityItem.color
                    };
                });
            }).flatten().value();
        }
    },
    data() {
        return {
            seriesList: SERIES_LIST.concat(['Total']),
            clsList: CLASS_LIST.concat(['Neutral', 'Total']),
            rarityList: [{name: 'Total', color: '#333'}].concat(_.clone(RARITY_LIST).reverse()),
            expandedSeries: ''
        };
    },
    methods: {
        getCountsItem(counts, series, cls, rarity) {
            counts[series] = counts[series] || {};
            counts[series][cls] = counts[series][cls] || {};
            counts[series][cls][rarity] = counts[series][cls][rarity] || {
                target: 0,
                owned: 0
            };

            return counts[series][cls][rarity];
        },
        updateCounts(counts, series, cls, rarity, addItem) {
            const updatedItem = this.getCountsItem(counts, series, cls, rarity);
            updatedItem.target += addItem.target;
            updatedItem.owned += addItem.owned;
        },

        getTdText(series, cls, rarity) {
            const item = this.getCountsItem(this.counts, series, cls, rarity);
            return item.target == item.owned ? item.target : `${item.owned}/${item.target}`;
        },
        getTdCls(series, cls, rarity) {
            const item = this.getCountsItem(this.counts, series, cls, rarity);
            return item.target == item.owned ? '' : 'grey';
        },

        onSeriesClicked(series) {
            this.expandedSeries = this.expandedSeries == series ? '' : series;
        },
        onCellClicked(filter) {
            this.$store.commit({
                type: types.LACKS_SELECT_CELL,
                filter
            });
        }
    }
};

</script>
<style lang="less" scoped>
tr {
    &.tline {
        border-top: 1px solid #d7d7d7;
    }
}
td {
    &.bold {
        font-weight: bold;
    }
    &.grey {
        background-color: #e1e1e1;
    }
}
</style>