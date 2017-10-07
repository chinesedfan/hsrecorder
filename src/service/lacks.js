'use strict';

import _ from 'lodash';
import {execSql} from '../common/database';

const SQL_LOAD_LACKS_DATA = 'SELECT * FROM lacks';
const SQL_INSERT_LACKS_ROW = 'INSERT INTO lacks(card_id, card_name, card_quality) VALUES(?, ?, ?)';
const SQL_DELETE_LACKS_ROW = 'DELETE FROM lacks WHERE id IN (SELECT min(id) FROM lacks WHERE card_id = ?)';

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
