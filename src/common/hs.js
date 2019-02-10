'use strict';

export const CLASS_LIST = ['Druid', 'Hunter', 'Mage', 'Paladin', 'Priest', 'Rogue', 'Shaman', 'Warlock', 'Warrior'];
export function getClassByNumber(n) {
    return n == 12 ? 'Neutral' : CLASS_LIST[n - 2];
}

export function getRarityByNumber(n) {
    switch (n) {
    case 5: return 'Legendary';
    case 4: return 'Epic';
    case 3: return 'Rare';
    case 1:
    default:
        return 'Common';
    }
}
export const RARITY_LIST = [
    {name: 'Legendary', color: 'orange'},
    {name: 'Epic', color: 'purple'},
    {name: 'Rare', color: 'blue'},
    {name: 'Common', color: '#333'}
];

export const SERIES_LIST = [
    // 2013
    'CLASSIC',
    // 2014
    'NAXX', 'GVG',
    // 2015
    'BRM', 'AT', 'LOE',
    // 2016
    'OG', 'KAR', 'CFM',
    // 2017
    'UNG', 'ICC', 'LOOT',
    // 2018
    'GIL', 'BOT', 'TRL'
];
