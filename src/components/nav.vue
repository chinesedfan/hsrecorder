<template>
    <ul class="nav nav-tabs">
        <router-link v-for="(item, i) in items" :to="`/${items[i].toLowerCase()}`"
                tag="li" active-class="active">
            <a>{{ item }}</a>
        </router-link>
    </ul>
</template>
<script>
'use strict';

export default {
    props: {
        items: Array
    }
};

</script>
<style lang="less">
    
</style>