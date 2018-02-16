'use strict';

import _ from 'lodash';
import {execSql} from '../common/database';

const SQL_INIT_ARENA = 'CREATE TABLE IF NOT EXISTS arena(id integer PRIMARY KEY UNIQUE,day date,class varchar,wins integer)';
const SQL_LOAD_ARENA_DATA = 'SELECT id, day, class as cls, wins FROM arena';
const SQL_INSERT_ARENA_ROW = 'INSERT INTO arena(id, day, class, wins) VALUES(?, ?, ?, ?)';
const SQL_DELETE_ARENA_ROW = 'DELETE FROM arena WHERE id = ?';

export {SQL_INIT_ARENA, SQL_LOAD_ARENA_DATA, SQL_INSERT_ARENA_ROW};

export function loadArenaData() {
    return execSql(SQL_LOAD_ARENA_DATA).then((rs) => {
        return _.map(rs.rows, (r) => {
            return _.pick(r, ['id', 'day', 'cls', 'wins']);
        });
    });
}

export function insertArenaRow(row) {
    return execSql(SQL_INSERT_ARENA_ROW, [row.id, row.day, row.cls, row.wins]);
}

export function deleteArenaRow(id) {
    return execSql(SQL_DELETE_ARENA_ROW, [id]);
}
