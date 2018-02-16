'use strict';

import _ from 'lodash';

/**
 * Database location:
 *     Windows Vista or 7: \Users\_username_\AppData\Local\Google\Chrome\User Data\Default\databases
 *     Windows XP: \Documents and Settings\_username_\Local Settings\Application Data\Google\Chrome\User Data\Default\databases
 *     Mac OS X: ~/Library/Application\ Support/Google/Chrome/Default/databases
 *     Linux: ~/.config/google-chrome/Default/databases
 */
const db = window.openDatabase('hsdb', '1.0', 'HearthStone Records', '4096');

export function execSql(sql, args) {
    return new Promise((resolve, reject) => {
        db.transaction((t) => {
            t.executeSql(sql, args || [], (tx, rs) => {
                resolve(rs);
            }, (tx, err) => {
                reject(err);
            });
        });
    });
}

export function execSqls(sqls, args, onEachSucc, onEachErr) {
    return new Promise((resolve, reject) => {
        let count = 0;
        const realOnSucc = (tx, rs) => {
            count++;
            onEachSucc && onEachSucc(rs);
            if (count == sqls.length) {
                resolve();
            }
        };
        const realOnErr = (tx, err) => {
            onEachErr && onEachErr(err);
            reject(err);
        };
        db.transaction((t) => {
            for (let i = 0; i < sqls.length; i++) {
                t.executeSql(sqls[i], args[i], realOnSucc, realOnErr);
            }
        });
    });
}

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

export function fillStatement(sql, obj) {
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
