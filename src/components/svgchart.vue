<template>
    <div :class="clsNames" :config="{svgData, svgOptions}"></div>
</template>
<script type="text/javascript">
'use strict';

export default {
    props: {
        clsNames: String,
        svgData: [Array, Object],
        svgOptions: Object
    },
    mounted() {
        this.redraw();
    },
    updated() {
        // if no changes to the template, it will not be triggered
        this.redraw();
    },
    methods: {
        redraw() {
            this.svgObject && this.svgObject.destroy();

            this.svgObject = new Venus.SvgChart(this.$el, this.svgData, this.svgOptions);
        }
    }
};

</script>
<style lang="less">
    
</style>