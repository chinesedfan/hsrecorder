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
    'CLASSIC', 'NAXX', 'GVG', 'BRM', 'AT', 'LOE', 'OG',
    'KAR', 'CFM', 'UNG', 'ICC', 'LOOT', 'GIL'
];
