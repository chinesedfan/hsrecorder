<template>
    <div :class="clsNames" class="lacks-list">
        <div class="list-header">
            <div>{{ title }}</div>
            <div>{{ items.length }}</div>
        </div>
        <div class="list-bottom" ref="bottom">
            <table><tbody>
                <tr v-for="item in items" :data-id="item.id" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave"><td>
                    <label :style="{color: color}">{{ item.name }}</label>
                </td></tr>
            </tbody></table>
        </div>
        <div v-show="previewSrc" class="list-preview" :style="previewStyle"><img :src="previewSrc" @load="onPreviewLoaded"></div>
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
    },
    data() {
        return {
            previewSrc: '',
            previewStyle: null
        };
    },
    methods: {
        onMouseEnter(e) {
            const tr = e.currentTarget;
            const id = tr.getAttribute('data-id');

            this.previewSrc = `http://i1.17173cdn.com/8hpoty/YWxqaGBf/images/resource/new_middler/${id}.png`; // 190x270
            this.previewStyle = {
                top: Math.max(0, tr.offsetTop - 270 - this.$refs.bottom.scrollTop) + 'px',
                right: tr.clientWidth + 'px'
            };
        },
        onMouseLeave() {
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
        &:hover {
            background-color: #e1e1e1;
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