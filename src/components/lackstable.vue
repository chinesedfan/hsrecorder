<template>
    <div class="lacks-table" :class="clsNames">
        <table><tbody>
            <tr>
                <th></th>
                <th v-for="cls in clsList">{{ cls }}</th>
            </tr>
        </tbody></table>
        <transition-group name="fade" tag="table">
            <tr v-for="(item, index) in rowItems" :key="index"
                    v-show="item.rarity == 'Total' || item.series == expandedSeries"
                    :class="{tline: item.rarity == 'Total' || item.rarity == 'Common'}">
                <td class="bold" @click="onSeriesClicked(item.series)">{{ item.rarity == 'Total' ? item.series : '' }}</td>
                <td v-for="cls in clsList" :style="{color: item.color}"
                        @click="onCellClicked({series: item.series, cls: cls})">
                    <div class="bkg" :style="{width: getTdWidth(item.series, cls, item.rarity)}"></div>
                    <div class="text" :class="{selected: getTdSelected(item.series, cls, item.rarity)}">{{ getTdText(item.series, cls, item.rarity) }}</div>
                </td>
            </tr>
        </transition-group>
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
        items: Array,
        itemsFilter: Object
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
        getTdWidth(series, cls, rarity) {
            const item = this.getCountsItem(this.counts, series, cls, rarity);
            return (item.target - item.owned) * 100 / item.target + '%';
        },
        getTdSelected(series, cls, rarity) {
            const item = this.getCountsItem(this.counts, series, cls, rarity);
            return this.itemsFilter.series == series && this.itemsFilter.cls == cls;
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
@height: 21;
tr {
    &.tline {
        border-top: 1px solid #d7d7d7;
    }
}
td {
    position: relative;
    height: unit(@height, px);

    &.bold {
        font-weight: bold;
    }

    .bkg {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        background-color: #e1e1e1;
    }
    .text {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;

        &.selected {
            border: 1px solid red;
        }
    }
}

.fade {

    &-enter, &-leave-to {
        transform: translateY(unit(-@height, px));
        opacity: 0;
    }
    &-enter-active, &-leave-active {
        transition: all .2s ease;
    }
}
</style>