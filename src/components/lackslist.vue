<template>
    <div :class="clsNames" class="lacks-list">
        <div class="list-header">
            <div>{{ title }}</div>
            <div>{{ items.length }}</div>
        </div>
        <div class="list-bottom" ref="bottom">
            <table><tbody>
                <tr v-for="item in finalItems" :data-id="item.id" @click="onItemClicked(item)" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave"><td>
                    <label :style="{color: color}">{{ item.name }}</label>
                    <div v-if="isEditMode && item.pendingCount" class="count">{{ item.pendingCount }}</div>
                </td></tr>
            </tbody></table>
        </div>
        <div v-show="previewSrc" class="list-preview" :style="previewStyle"><img :src="previewSrc" @load="onPreviewLoaded"></div>
    </div>
</template>
<script>
'use strict';

import _ from 'lodash';
import {mapMutations} from 'vuex';
import * as types from '../store/mutation-types';

export default {
    props: {
        clsNames: String,
        title: String,
        color: String,
        items: Array
    },
    computed: {
        isEditMode() {
            return this.$store.state.lacks.isEditMode;
        },
        finalItems() {
            const pendingItems = this.$store.state.lacks.editPendingList;
            return _.map(this.items, (item) => {
                const pendingItem = _.find(pendingItems, (x) => x.id == item.id);
                return {
                    ...item,
                    pendingCount: (pendingItem && pendingItem.lackCount) || 0
                };
            });
        }
    },
    data() {
        return {
            previewSrc: '',
            previewStyle: null
        };
    },
    methods: {
        ...mapMutations({
            increaseItem: types.LACKS_INCREASE_ITEM,
            decreaseItem: types.LACKS_DECREASE_ITEM
        }),
        onItemClicked(item) {
            if (!this.isEditMode) return;

            this.increaseItem(item);
        },
        onMouseEnter(e) {
            if (this.isEditMode) return;

            const tr = e.currentTarget;
            const id = tr.getAttribute('data-id');

            this.previewSrc = `http://i1.17173cdn.com/8hpoty/YWxqaGBf/images/resource/new_middler/${id}.png`; // 190x270
            this.previewStyle = {
                top: Math.max(0, tr.offsetTop - 270 - this.$refs.bottom.scrollTop) + 'px',
                right: tr.clientWidth + 'px'
            };
        },
        onMouseLeave() {
            if (this.isEditMode) return;

            this.previewSrc = '';
        },
        onPreviewLoaded() {
            // TODO: show after loaded    
        }
    }
};

</script>
<style lang="less" scoped>
@import '../../less/flex.less';
.lacks-list {
    .flex-group-top(40px);
    position: relative;
}    
.list-header {
    font-weight: bold;
    text-align: center;
}
.list-bottom {
    overflow-y: scroll;

    td {
        position: relative;

        &:hover {
            background-color: #e1e1e1;
        }

        .count {
            position: absolute;
            left: 5px;
            top: 0;
            color: red;
        }
    }
    label {
        margin: 0;
    }
}
.list-preview {
    position: absolute;
}
</style>