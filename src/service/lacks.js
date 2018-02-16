'use strict';

import _ from 'lodash';
import {execSql, execSqls} from '../common/database';

const SQL_INIT_LACKS = 'CREATE TABLE IF NOT EXISTS lacks(id integer PRIMARY KEY AUTOINCREMENT UNIQUE,card_id integer,card_name text,card_quality integer)';
const SQL_LOAD_LACKS_DATA = 'SELECT * FROM lacks';
const SQL_INSERT_LACKS_ROW = 'INSERT INTO lacks(card_id, card_name, card_quality) VALUES(?, ?, ?)';
const SQL_DELETE_LACKS_ROW = 'DELETE FROM lacks WHERE id IN (SELECT min(id) FROM lacks WHERE card_id = ?)';

export {SQL_INIT_LACKS, SQL_LOAD_LACKS_DATA, SQL_INSERT_LACKS_ROW};

export function loadLacksData() {
    return execSql(SQL_LOAD_LACKS_DATA).then((rs) => {
        const countMap = _(rs.rows)
                .groupBy('card_id')
                .mapValues((g) => g.length)
                .value();
        return _.map(_.keys(countMap), (id) => {
            return {
                id,
                lackCount: countMap[id]
            };
        });
    });
}

export function insertLacksRow(row) {
    return execSql(SQL_INSERT_LACKS_ROW, [row.card_id, row.card_name, row.card_quality]);
}

export function deleteLacksRow(id) {
    return execSql(SQL_DELETE_LACKS_ROW, [id]);
}

export function updateInBatch(rows, ids, onEachSucc, onEachErr) {
    const args = _.map(rows, (r) => [r.card_id, r.card_name, r.card_quality])
            .concat(_.map(ids, (id) => [id]));
    const sqls = _.map(args, (a, i) => (i < rows.length ? SQL_INSERT_LACKS_ROW : SQL_DELETE_LACKS_ROW));
    return execSqls(sqls, args, onEachSucc, onEachErr);
}
