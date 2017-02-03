<template>
    <hsr-svgchart :svgData="trendData" :svgOptions="trendOptions"></hsr-svgchart>
</template>
<script>
'use strict';

import _ from 'lodash';
import {mapGetters, mapMutations} from 'vuex';
import SvgChart from './svgchart';
import * as types from '../store/mutation-types';
import * as ArenaService from '../service/arena';

export default {
    computed: {
        trendData() {
            const wins = this.wins();

            return [{
                name: `totalGame = ${wins.length}\ntotalWins = ${this.totalWins()}\ntotalAvg = ${this.totalAvg()}`,
                data: wins
            }];
        },
        trendOptions() {
            return {
                axis: {
                    x: {
                        tickWidth: 20,
                        ticks: _.map(this.wins(), (w, i) => i + 1)
                    },
                    y: {
                        min: 0,
                        max: 11, // if not set, empty input will cause the chart library to crash
                        total: 11,
                        tickSize: 2,
                        tickWidth: 20,
                        rotate: 90
                    }
                },
                line: {
                    dots: true,
                    dotRadius: 6
                },
                icons: {
                    0: 'circle'
                },
                legend: {
                    position: ['right', 'center'],
                    borderColor: 'white'
                },
                threshold: {
                    y: {
                        value: this.totalAvg()
                    }
                }
            };
        }
    },
    components: {
        'hsr-svgchart': SvgChart
    },
    methods: {
        ...mapGetters(['countByCls', 'countByWins', 'winsByCls', 'wins', 'totalWins', 'totalAvg']),
        ...mapMutations({
            updateRows: types.ARENA_UPDATE_ROWS
        })
    },
    beforeRouteEnter(to, from, next) {
        ArenaService.loadArenaData().then((rows) => {
            next((vm) => {
                vm.updateRows(rows);
            });
        });
    }
};

</script>
<style lang="less">
    
</style>