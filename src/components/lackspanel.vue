<template>
    <div>
        <div class="lacks-control">
            <input class="form-control lacks-card">
            <button class="btn btn-default lacks-add">Insert</button>
            <button class="btn btn-default lacks-del">Delete</button>
            <button class="btn btn-default lacks-submit" @click="onBtnSubmitClicked">Submit</button>
        </div>
        <div class="checkbox-wrapper" @click="onCheckboxClicked">
            <input type="checkbox" :checked="isEditMode" />
            <span> edit mode </span>
            <span class="red">{{ msg }}</span>
        </div>
    </div>
</template>
<script>
'use strict';

import * as types from '../store/mutation-types';

export default {
    props: {
        isEditMode: Boolean
    },
    computed: {
        msg() {
            return this.$store.state.lacks.editMessage;
        }
    },
    methods: {
        onCheckboxClicked() {
            this.$store.commit(types.LACKS_UPDATE_EDIT_MODE, !this.isEditMode);
        },
        onBtnSubmitClicked() {
            this.$store.dispatch(types.LACKS_SUBMIT_PENDING);
        }
    }
};

</script>
<style lang="less" scoped>
.lacks-control {
    margin: 20px auto 10px;
    width: 40%;
    height: 34px;
}
.lacks-card {
    width: 40%;
    float: left;
}
.lacks-add, .lacks-del, .lacks-submit {
    width: 20%;
    float: left;
}
.checkbox-wrapper {
    margin: 0 auto 20px;
    width: 40%;
    height: 20px;
    font-size: 15px;

    input {
        width: 15px;
    }
    .red {
        color: red;
    }
}
</style>