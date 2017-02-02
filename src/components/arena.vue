<template>
    <hsr-nav :items="items"></hsr-nav>
</template>
<script type="text/javascript">
'use strict';

import Nav from './nav';

export default {
    components: {
        'hsr-nav': Nav
    },
    data() {
        return {
            items: ['Arena', 'Packs', 'Lacks', 'Export']
        };
    }
};

</script>
<style lang="less">
    
</style>