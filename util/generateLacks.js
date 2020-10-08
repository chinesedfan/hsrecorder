const fs = require('fs')
const path = require('path')
const _ = require('lodash');

// Support by https://hsreplay.net/collection/mine/
// Original request: https://hsreplay.net/api/v1/collection/?region=5&account_lo=36393894
const res = require('../dist/collect.json')

const cardDefsFile = path.resolve(__dirname, '../bin/CardDefs.xml')
const cardsMap = require('../bin/cardlist.js')

// copy from src/service/lacks.js
const SQL_INSERT_LACKS_ROW = 'INSERT INTO lacks(card_id, card_name, card_quality) VALUES(?, ?, ?)'
function val2str(val) {
    let x = val;
    if (x instanceof Array) return _.map(x, val2str).join(',');

    // fix quote
    if (typeof x === 'string') {
        x = x.replace(/'/g, '\'\'');
    }
    // convert to string
    x = (x === '' || x === null) ? 'NULL' : `'${x}'`;

    return x;
}
function fillStatement(sql, obj) {
    let keys = [];
    sql.replace(/\(([^)]+)\)/, (match, fields) => {
        keys = _.map(fields.split(','), (token) => token.trim().replace(/"(.+)"/, '$1'));
    });

    let index = 0;
    return sql.replace(/\?/g, () => {
        const k = keys[index++];
        return val2str(obj[k]);
    });
}
// end of copy

main()
function main() {
    const m1 = cardID2id()
    const sqls = []

    cardsMap.forEach(card => {
        const id = m1[card.id]
        const [normal, golden] = res.collection[id] || [0, 0]

        let lack
        if (card.rarity === 5) { // Legendary
            lack = Math.max(0, 1 - normal)
        } else {
            lack = Math.max(0, 2 - normal)
        }

        if (lack) {
            const sql = fillStatement(SQL_INSERT_LACKS_ROW, {
                card_id: card.id,
                card_name: card.name,
                card_quality: card.rarity,
            })
            // 1 or 2
            sqls.push(sql)
            if (lack > 1) {
                sqls.push(sql)
            }
        }
    })

    console.log(sqls.join(';\n'))
}

function cardID2id() {
    // <Entity CardID="AT_001" ID="2539" version="2">
    const rEntity = /<Entity CardID="([^"]+)" ID="([^"]+)"/
    const ret = {}

    let matches
    const lines = fs.readFileSync(cardDefsFile, 'utf8').split('\n')
    lines.forEach(line => {
        if (matches = rEntity.exec(line)) {
            ret[matches[1]] = matches[2]
        }
    })

    return ret
}
