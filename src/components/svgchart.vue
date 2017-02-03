<template>
    <div></div>
</template>
<script type="text/javascript">
'use strict';

export default {
    props: {
        svgData: [Array, Object],
        svgOptions: Object
    },
    mounted() {
        this.redraw();
    },
    updated() {
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