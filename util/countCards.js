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
    var TOTAL = 'Total';

    var series = getSeries(item.CardID);
    var cls = getClassName(item.CLASS);
    var rarity = getRarity(item.RARITY);

    addCount(counts, series, cls, rarity);
    addCount(counts, series, cls, TOTAL);
    addCount(counts, TOTAL, cls, rarity);
    addCount(counts, TOTAL, cls, TOTAL);

    addCount(counts, series, TOTAL, rarity);
    addCount(counts, series, TOTAL, TOTAL);
    addCount(counts, TOTAL, TOTAL, rarity);
    addCount(counts, TOTAL, TOTAL, TOTAL);
});
// console.log(JSON.stringify(counts, null, 4));
_.each(counts, function(item, series) {
    var clsItem = item["Druid"];
    var extItem = item["Neutral"];

    var row = [item2arr(clsItem), item2arr(extItem)];
    console.log('    ' + JSON.stringify(row) + ', // ' + series);

    function item2arr(item) {
        return _.map(['Common', 'Rare', 'Epic', 'Legendary'], function(q) {
            return item[q] || 0;
        });
    }
});

function getSeries(str) {
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
    var prefix = str.replace(/^([^_]+)_.*$/, '$1');
    return map[prefix] || 'CLASSIC';
}
function getClassName(number) {
    var list = ["Druid", "Hunter", "Mage", "Paladin", "Priest", "Rogue", "Shaman", "Warlock", "Warrior"];
    if (number == 12) {
        return 'Neutral';
    } else {
        return list[number - 2];
    }
}
function getRarity(number) {
    var map = {
        1: 'Common',
        3: 'Rare',
        4: 'Epic',
        5: 'Legendary'
    };
    return map[number];
}

function getCount(counts, series, cls, rarity) {
    counts[series] = counts[series] || {};
    counts[series][cls] = counts[series][cls] || {};
    return counts[series][cls][rarity] || 0;
}
function addCount(counts, series, cls, rarity) {
    var val = getCount(counts, series, cls, rarity) + 1;
    counts[series][cls][rarity] = val;
}
