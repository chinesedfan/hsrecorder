<template>
    <div class="arena-page">
        <hsr-svgchart :svgData="trendData" :svgOptions="trendOptions" />
        <div>
            <div class="arena-left">
                <hsr-svgchart :svgData="clsAvgData" :svgOptions="clsAvgOptions" />
                <div>
                    <hsr-svgchart clsNames="arena-pie" :svgData="clsPieData" :svgOptions="pieOptions" />
                    <hsr-svgchart clsNames="arena-pie" :svgData="winsPieData" :svgOptions="pieOptions" />
                </div>
            </div>
            <div class="arena-right"></div>
        </div>
    </div>
</template>
<script>
'use strict';

import _ from 'lodash';
import {mapGetters, mapMutations} from 'vuex';
import SvgChart from './svgchart';
import {CLASS_LIST} from '../common/hs';
import * as types from '../store/mutation-types';
import * as ArenaService from '../service/arena';

export default {
    computed: {
        trendData() {
            const wins = this.wins().value();

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
                        ticks: this.wins().map((w, i) => i + 1).value()
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
        },
        clsAvgData() {
            const winsByCls = this.winsByCls().value();
            const countByCls = this.countByCls().value();

            return [{
                name: 0,
                data: _(CLASS_LIST).groupBy().mapValues((cls) => {
                    return countByCls[cls] ? (winsByCls[cls] / countByCls[cls]).toFixed(2) : 0;
                }).value()
            }]
        },
        clsAvgOptions() {
            return {
                axis: {
                    x: {
                        total: 9,
                        tickWidth: 60,
                        ticks: CLASS_LIST,
                        labelRotate: 33
                    },
                    y: {
                        min: 0,
                        max: 11,
                        total: 11,
                        tickSize: 2,
                        tickWidth: 16,
                        rotate: 90
                    }
                },
                bar: {
                    radius: 0
                }
            };
        },
        clsPieData() {
            return this.generatePieData(this.countByCls());
        },
        winsPieData() {
            return this.generatePieData(this.countByWins());
        },
        pieOptions() {
            return {
                pie: {
                    radius: 60, 
                    rotate: 45
                }
            };
        }
    },
    components: {
        'hsr-svgchart': SvgChart
    },
    methods: {
        generatePieData(countMap) {
            return _(countMap).mapValues((c, k) => {
                return {
                    name: k,
                    data: c
                };
            }).values().sortBy((item) => -item.data).value();
        },
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
<style lang="less" scoped>
@import '../../less/flex.less';
.arena-page {
    .flex-group-top(160px);
}
.arena-left {
    .flex-group-top(160px);

    float: left;
    width: 66.67%;
    height: 100%;
}
.arena-right {
    float: left;
    width: 33.33%;
    height: 100%;
}
.arena-pie {
    float: left;
    width: 50%;
    height: 100%;
}
</style>