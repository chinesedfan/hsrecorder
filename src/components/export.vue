<template>
    <div class="export-page">
        <div class="export-control">
            <button class="btn btn-default export-import" @click="onBtnImportClicked">Import</button>
            <button class="btn btn-default export-export" @click="onBtnExportClicked">Export</button>
        </div>
        <div>
            <div class="progress-wrapper">
                <div class="progress-title">{{ progressDone + '/' + progressTotal }}</div>
                <div class="progress-bar" :style="{width: progressDone * 100 / progressTotal + '%'}"></div>
            </div>
            <textarea class="export-content" :value="progressContent"></textarea>
        </div>
    </div>
</template>
<script>
'use strict';

import _ from 'lodash';

import {execSql, execSqls, fillStatement} from '../common/database';
import {SQL_DROP_ARENA, SQL_INIT_ARENA, SQL_EXPORT_ARENA_ROW, SQL_LOAD_ARENA_DATA} from '../service/arena';
import {SQL_DROP_LACKS, SQL_INIT_LACKS, SQL_EXPORT_LACKS_ROW, SQL_LOAD_LACKS_DATA} from '../service/lacks';

export default {
    data() {
        return {
            progressDone: 0,
            progressTotal: 0,
            progressContent: ''
        };
    },
    methods: {
        resetProgress(n) {
            this.progressDone = 0;
            this.progressTotal = n;
        },


        onBtnImportClicked() {
            const sqls = _.filter(this.progressContent.split(';\n'));
            if (!sqls.length) return;
            this.resetProgress(sqls.length);

            let hasAlert = false;
            execSqls(sqls, [], () => {
                this.progressDone++;
            }, (err) => {
                if (hasAlert) return;

                hasAlert = true;
                alert(err.message);
            });
        },
        onBtnExportClicked() {
            this.resetProgress(2);

            const p1 = execSql(SQL_LOAD_ARENA_DATA).then((rs) => rs.rows).then((rows) => {
                return _.map(rows, (item) => fillStatement(SQL_EXPORT_ARENA_ROW, {
                    ...item,
                    class: item.cls // special case
                }));
            }).then((sqls) => {
                this.progressDone++;
                return [SQL_DROP_ARENA, SQL_INIT_ARENA].concat(sqls);
            });

            const p2 = execSql(SQL_LOAD_LACKS_DATA).then((rs) => rs.rows).then((rows) => {
                return _.map(rows, (item) => fillStatement(SQL_EXPORT_LACKS_ROW, item));
            }).then((sqls) => {
                this.progressDone++;
                return [SQL_DROP_LACKS, SQL_INIT_LACKS].concat(sqls);
            });

            Promise.all([p1, p2]).then((res) => {
                const sqls = _.reduce(res, (memo, arr) => memo.concat(arr), []);

                this.progressContent = sqls.join(';\n');
            });
        }
    }
};

</script>
<style lang="less" scoped>
@import '../../less/flex.less';
.export-page {
    .flex-group-top(74px);
}

.export-control {
    margin: 0 auto;
    padding: 20px 0;
    width: 50%;
    height: 34px;
}
.export-import, .export-export {
    float: left;
    width: 50%;
}

.progress-wrapper {
    margin: 0px auto;
    width: 50%;
    height: 20px;
    position: relative;
}
.progress-title {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100px;
    height: 20px;
    margin-left: -50px;
    margin-top: -10px;
    text-align: center;
}
.progress-bar {
    width: 0px;
    background-color: green;
}

.export-content {
    display: block;
    margin: 0px auto;
    width: 50%;
    height: 80%;
}

</style>