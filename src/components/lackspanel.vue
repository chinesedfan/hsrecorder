<template>
    <div>
        <div class="lacks-control">
            <input class="form-control lacks-card">
            <button class="btn btn-default lacks-add">Insert</button>
            <button class="btn btn-default lacks-del">Delete</button>
        </div>
        <div class="checkbox-wrapper">
            <input type="checkbox"></input>
            <span>edit mode</span>
        </div>
    </div>
</template>
<script>
'use strict';

export default {
};

</script>
<style lang="less" scoped>
.lacks-control {
    margin: 20px auto 10px;
    width: 33%;
    height: 34px;
}
.lacks-card {
    width: 50%;
    float: left;
}
.lacks-add, .lacks-del {
    width: 25%;
    float: left;
}
.checkbox-wrapper {
    margin: 0 auto 20px;
    width: 33%;
    height: 20px;
    font-size: 15px;

    input {
        width: 15px;
    }
}
</style>