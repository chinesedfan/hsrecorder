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
export const QUALITY_LIST = ['Legendary', 'Epic', 'Rare', 'Common'];
export const COLOR_LIST = ['orange', 'purple', 'blue', 'black'];

export const SERIES_LIST = ['CLASSIC', 'NAXX', 'GVG', 'BRM', 'AT', 'LOE', 'OG', 'KAR', 'CFM', 'UNG'];
