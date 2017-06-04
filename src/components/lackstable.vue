<template>
    <div class="lacks-table" :class="clsNames">
        <table><tbody>
            <tr>
                <th></th>
                <th v-for="cls in colNames">{{ cls }}</th>
            </tr>
            <tr v-for="series in rowNames" class="tline">
                <td class="bold">{{ series }}</td>
                <td v-for="cls in colNames">{{ 123 }}</td>
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
        clsNames: String
    },
    data() {
        return {
            colNames: CLASS_LIST.concat(['Neutral', 'Total']),
            rowNames: CLASS_LIST.concat(['Total']),
            expandedRow: -1
        };
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
}
</style>