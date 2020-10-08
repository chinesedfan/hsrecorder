<template>
    <ul class="nav nav-tabs">
        <router-link v-for="(item, i) in items" :to="`/${items[i].toLowerCase()}`"
                custom v-slot="{ href, isActive }">
            <li :class="isActive ? 'active' : ''">
                <a :href="href">{{ item }}</a>
            </li>
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