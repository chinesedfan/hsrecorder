<template>
    <ul class="nav nav-tabs">
        <li v-for="(item, index) in items" :class="{ active: index == selectedIndex }"><a>{{ item }}</a></li>
    </ul>
</template>
<script type="text/javascript">
'use strict';

export default {
    props: {
        items: Array,
        selectedIndex: {
            type: Number,
            default: 0
        }
    }
};

</script>
<style lang="less">
    
</style>