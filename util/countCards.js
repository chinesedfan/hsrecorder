/**
 * Cards
 * - Base, 10 * 9 + 43 = 133
 * - Classic, 15 * 9 + 110 = 245(not count the 4 award)
 * - Naxx, 1 * 9 + 21 = 30
 * - GVG, 8 * 9 + 51 = 123
 * - BRM, 2 * 9 + 13 = 31
 * - AT, 9 * 9 + 1 + 50 = 131(Hunter has 2 legend)
 * - LOE, 3 * 9 + 18 = 45
 * - OG, 9 * 9 + 53 = 134
 * - KAR, 3 * 9 + 18 = 45
 */
var fs = require('fs');
var _ = require('lodash');
require('../bin/cardlist.js');

var counts = {
    // {series: {cls: {rarity: count}}}
}; 
_.each(CardList, function(item) {
    var map = {
        FP1: 'NAXX',
        GVG: 'GVG',
        BRM: 'BRM',
        AT: 'AT',
        LOE: 'LOE',
        LOEA10: 'LOE',
        OG: 'OG',
        KAR: 'KAR'
    };
    var prefix = item.CardID.replace(/^([^_]+)_.*$/, '$1');
    var series = map[prefix] || 'Classic';

    addCount(counts, series, item.CLASS, item.RARITY);
    addCount(counts, series, item.CLASS, 'TOTAL');
    addCount(counts, 'TOTAL', item.CLASS, item.RARITY);
    addCount(counts, 'TOTAL', item.CLASS, 'TOTAL');

    addCount(counts, series, 'TOTAL', item.RARITY);
    addCount(counts, series, 'TOTAL', 'TOTAL');
    addCount(counts, 'TOTAL', 'TOTAL', item.RARITY);
    addCount(counts, 'TOTAL', 'TOTAL', 'TOTAL');
});
console.log(JSON.stringify(counts, null, 4));

function getCount(counts, series, cls, rarity) {
    counts[series] = counts[series] || {};
    counts[series][cls] = counts[series][cls] || {};
    return counts[series][cls][rarity] || 0;
}
function addCount(counts, series, cls, rarity) {
    var val = getCount(counts, series, cls, rarity) + 1;
    counts[series][cls][rarity] = val;
}
