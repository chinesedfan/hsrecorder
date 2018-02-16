<template>
    <div class="export-page">
        <div class="export-control">
            <button class="btn btn-default export-import">Import</button>
            <button class="btn btn-default export-export">Export</button>
        </div>
        <div>
            <div class="progress-wrapper">
                <div class="progress-title"></div>
                <div class="progress-bar"></div>
            </div>
            <textarea class="export-content"></textarea>
        </div>
    </div>
</template>
<script>
'use strict';

export default {
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