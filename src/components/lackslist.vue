<template>
    <div :class="clsNames" class="lacks-list">
        <div class="list-header">
            <div>{{ title }}</div>
            <div>{{ items.length }}</div>
        </div>
        <div class="list-bottom">
            <table><tbody>
                <tr v-for="item in items"><td>
                    <label :style="{color: color}">{{ item.name }}</label>
                </td></tr>
            </tbody></table>
        </div>
    </div>
</template>
<script>
'use strict';

export default {
    props: {
        clsNames: String,
        title: String,
        color: String,
        items: Array
    }
};

</script>
<style lang="less" scoped>
@import '../../less/flex.less';
.lacks-list {
    .flex-group-top(40px);
}    
.list-header {
    font-weight: bold;
    text-align: center;
}
.list-bottom {
    overflow-y: scroll;

    td {
        &:hover {
            background-color: #e1e1e1;
        }
    }
    label {
        margin: 0;
    }
}
</style>