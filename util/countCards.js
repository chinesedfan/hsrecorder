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
    // {cls: {series: {rarity: count}}}
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

    addCount(counts, item.CLASS, series, item.RARITY);
    addCount(counts, item.CLASS, series, 'total');
    addCount(counts, item.CLASS, 'total', item.RARITY);
    addCount(counts, item.CLASS, 'total', 'total');

    addCount(counts, 'total', series, item.RARITY);
    addCount(counts, 'total', series, 'total');
    addCount(counts, 'total', 'total', item.RARITY);
    addCount(counts, 'total', 'total', 'total');
});
console.log(JSON.stringify(counts, null, 4));

function getCount(counts, cls, series, rarity) {
    counts[cls] = counts[cls] || {};
    counts[cls][series] = counts[cls][series] || {};
    return counts[cls][series][rarity] || 0;
}
function addCount(counts, cls, series, rarity) {
    var val = getCount(counts, cls, series, rarity) + 1;
    counts[cls][series][rarity] = val;
}
