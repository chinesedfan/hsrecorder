'use strict';

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

export function execSqls(sqls, onEachSucc, onEachErr) {
    db.transaction((t) => {
        for (let i = 0; i < sqls.length; i++) {
            t.executeSql(sqls[i], [], onEachSucc, onEachErr);
        }
    });
}
