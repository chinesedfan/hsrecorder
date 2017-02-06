<template>
    <div :class="`arena-table ${clsNames}`">
        <div>
            <div>
                <button class="arena-btn btn btn-default" @click="onBtnAddClicked">Add Editing</button>
                <button class="arena-btn btn btn-default" @click="onBtnDelClicked">Remove Last</button>
            </div>
            <table><tbody>
                <tr><th>id</th><th>day</th><th>class</th><th>wins</th></tr>
                <tr>
                    <td><input class="form-control" v-model="idEditing"></td>
                    <td><input class="form-control" v-model="dayEditing"></td>
                    <td><select class="form-control" v-model="clsEditing">
                        <option v-for="cls in CLASS_LIST" :value="cls">{{ cls }}</option>
                    </select></td>
                    <td><input class="form-control" v-model.number="winsEditing"></td>
                </tr>
            </tbody></table>
        </div>
        <div class="table-wrapper">
            <table><tbody>
                <tr v-for="item in reversedRows">
                    <td>{{ item.id }}</td>
                    <td>{{ item.day }}</td>
                    <td>{{ item.cls }}</td>
                    <td>{{ item.wins }}</td>
                </tr>
            </tbody></table>
        </div>
    </div>
</template>
<script>
'use strict';

import _ from 'lodash';
import {mapActions} from 'vuex';
import {CLASS_LIST} from '../common/hs';
import * as types from '../store/mutation-types';

export default {
    props: {
        clsNames: String,
        rows: Array
    },
    computed: {
        reversedRows() {
            return _.map(this.rows, (r, i, list) => list[list.length - 1 - i]);
        }
    },
    data() {
        return {
            CLASS_LIST,
            idEditing: 1,
            dayEditing: this.getTodayStr(),
            clsEditing: CLASS_LIST[0],
            winsEditing: 0
        };
    },
    watch: {
        rows(val) {
            this.idEditing = (val || []).length + 1;
            this.dayEditing = this.getTodayStr();
            this.clsEditing = CLASS_LIST[0];
            this.winsEditing = 0;
        }
    },
    methods: {
        getTodayStr() {
            const now = new Date();
            const y = now.getFullYear();
            let m = now.getMonth() + 1;
            let d = now.getDate();
            if (m < 10) m = '0' + m;
            if (d < 10) d = '0' + d;
            return [y, m, d].join('-');
        },
        ...mapActions({
            insertRow: types.ARENA_INSERT_ROW,
            deleteRow: types.ARENA_DELETE_ROW
        }),
        onBtnAddClicked() {
            this.insertRow({
                id: this.idEditing,
                day: this.dayEditing,
                cls: this.clsEditing,
                wins: this.winsEditing
            });
        },
        onBtnDelClicked() {
            if (_.isEmpty(this.reversedRows)) return;

            this.deleteRow(this.reversedRows[0].id);
        }
    }
};

</script>
<style lang="less" scoped>
@import '../../less/flex.less';
.arena-table {
    .flex-group-top(88px);
}
.arena-btn {
    float: left;
    width: 50%;
}
.table-wrapper {
    overflow-y: scroll;
}
</style>