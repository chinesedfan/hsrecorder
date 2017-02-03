'use strict';

import {execSql} from '../common/database';

const SQL_LOAD_ARENA_DATA = 'SELECT id, day, class, wins FROM arena';

export function loadArenaData() {
    return execSql(SQL_LOAD_ARENA_DATA).then((rs) => rs.rows);
}
