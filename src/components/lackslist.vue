<template>
    <div :class="clsNames" class="lacks-list">
        <div class="list-header">
            <div>{{ title }}</div>
            <div>{{ totalLackCount }}</div>
        </div>
        <div class="list-bottom" ref="bottom">
            <table><tbody>
                <tr v-for="item in finalItems" :data-id="item.id" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave"><td>
                    <label :style="{color: color}">{{ item.name }}</label>
                    <div v-if="isEditMode && item.pendingCount" class="count">{{ item.pendingCount > 0 ? '+' + item.pendingCount : item.pendingCount }}</div>
                    <div :class="{mask: shouldMaskLeft(item)}" class="left" @click="onLeftClicked(item)"></div>
                    <div :class="{mask: shouldMaskRight(item)}" class="right" @click="onRightClicked(item)"></div>
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
        isEditMode: Boolean,
        items: Array
    },
    computed: {
        finalItems() {
            const pendingItems = this.$store.state.lacks.editPendingList;
            return _.map(this.items, (item) => {
                const pendingItem = _.find(pendingItems, (x) => x.id == item.id);
                return {
                    ...item,
                    pendingCount: (pendingItem && pendingItem.pendingCount) || 0
                };
            });
        },
        totalLackCount() {
            return _.reduce(this.items, (sum, item) => {
                return sum + item.lackCount;
            }, 0);
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

        shouldMaskLeft(item) {
            return item.lackCount !== item.targetCount;
        },
        shouldMaskRight(item) {
            return !item.lackCount;
        },

        onLeftClicked(item) {
            if (!this.isEditMode) return;

            this.increaseItem(item);
        },
        onRightClicked(item) {
            if (!this.isEditMode) return;

            this.decreaseItem(item);
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

        .left, .right {
            position: absolute;
            top: 0;
            bottom: 0;
            &.mask {
                opacity: 0.5;
                background-color: #d7d7d7;
            }
        }
        .left {
            left: 0;
            right: 50%;
        }
        .right {
            left: 50%;
            right: 0;
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