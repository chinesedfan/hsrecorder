<template>
    <div class="lacks-table" :class="clsNames">
        <table><tbody>
            <tr>
                <th></th>
                <th v-for="cls in colNames">{{ cls }}</th>
            </tr>
            <tr v-for="series in rowNames" class="tline">
                <td class="bold">{{ series }}</td>
                <td v-for="cls in colNames" :class="getTdCls(series, cls, 'Total')">{{ getTdText(series, cls, 'Total') }}</td>
            </tr>
        </tbody></table>
    </div>
</template>
<script>
'use strict';

import _ from 'lodash';
import {CLASS_LIST, SERIES_LIST} from '../common/hs';

export default {
    props: {
        clsNames: String,
        items: Array
    },
    computed: {
        // {series: {cls: {rarity: count}}}
        counts() {
            const counts = {};
            const total = 'Total';
            const initialItem = {
                target: 0,
                owned: 0
            };
            _.each(this.items, (item) => {
                const addItem = {
                    target: item.rarity === 'Legendary' ? 1 : 2,
                    owned: item.count
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
        }
    },
    data() {
        return {
            colNames: CLASS_LIST.concat(['Neutral', 'Total']),
            rowNames: SERIES_LIST.concat(['Total']),
            expandedRow: -1
        };
    },
    methods: {
        updateCounts(counts, series, cls, rarity, addItem) {
            counts[series] = counts[series] || {};
            counts[series][cls] = counts[series][cls] || {};
            counts[series][cls][rarity] = counts[series][cls][rarity] || {
                target: 0,
                owned: 0
            };

            const updatedItem = counts[series][cls][rarity];
            updatedItem.target += addItem.target;
            updatedItem.owned += addItem.owned;
        },
        getTdText(series, cls, rarity) {
            const item = this.counts[series][cls][rarity];
            return item.target == item.owned ? item.target : `${item.owned}/${item.target}`;
        },
        getTdCls(series, cls, rarity) {
            const item = this.counts[series][cls][rarity];
            return item.target == item.owned ? '' : 'grey';
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