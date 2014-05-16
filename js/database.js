/*
   Database location:
       Windows Vista or 7: \Users\_username_\AppData\Local\Google\Chrome\User Data\Default\databases
       Windows XP: \Documents and Settings\_username_\Local Settings\Application Data\Google\Chrome\User Data\Default\databases
       Mac OS X: ~/Library/Application Support/Google/Chrome/Default/databases
       Linux: ~/.config/google-chrome/Default/databases
*/
var db = openDatabase("hsdb", "1.0", "HearthStone Records", "4096");

function initDB() {
    db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS arena(id integer PRIMARY KEY UNIQUE,day date,class varchar,wins integer)", []);
        tx.executeSql("CREATE TABLE IF NOT EXISTS packs(id integer PRIMARY KEY UNIQUE,day date,count_gl integer,count_ge integer,count_gr integer,count_gc integer,count_l integer,count_e integer,count_r integer,count_c integer,tip_gl text,tip_ge text,tip_gr text,tip_gc text,tip_l text,tip_e text,tip_r text,tip_c text,dust integer)", [], undefined, onSqlError);
    });
}

var arenaData;

function loadArenaData(container) {
    arenaData = window.arenaData = {};
    arenaData.trend = {};
    db.transaction(function(tx) {
        tx.executeSql("SELECT class, count(id) as nums, sum(wins) as wins FROM arena GROUP BY class", [], function(tx, rs) {
            arenaData.classNums = [];
            arenaData.classWins = [];
            arenaData.totalWins = 0;
            for (var i = 0; i < window.classNames.length; i++) {
                arenaData.classNums.push(0);
                arenaData.classWins.push(0);
            };
            for (var i = 0; i < rs.rows.length; i++) {
                var index = window.classMap[rs.rows.item(i).class];
                arenaData.classNums[index] = rs.rows.item(i).nums;
                arenaData.classWins[index] = rs.rows.item(i).wins;
                arenaData.totalWins += rs.rows.item(i).wins;
            }
            refreshRatesChart();
            refreshWinsChart();
        }, onSqlError);
        tx.executeSql("SELECT id, day, class, wins FROM arena", [], function(tx, rs) {
            arenaData.wins = [];
            arenaData.rows = [];
            for (var i = 0; i < rs.rows.length; i++) {
                arenaData.wins.push(rs.rows.item(i).wins);
                arenaData.rows.push(rs.rows.item(i));
            }
            if (!arenaData.trend.start) {
                arenaData.trend.start = 1;
                arenaData.trend.end = rs.rows.length + 1;
            }
            arenaData.totalNums = rs.rows.length;
            refreshTrendChart();
            refreshArenaTable();
        }, onSqlError);
    });
}

/*
   Should keep the continuity of all records
*/

function insertArenaRecord(row) {
    // only the exsited rows can be modified or insert at the end
    if (row.id < arenaData.trend.start - 1
        || row.id > arenaData.trend.end) {
        alert("invalid row.id=" + row.id);
        return;
    }
    db.transaction(function(tx) {
        tx.executeSql("INSERT INTO arena(id, day, class, wins) VALUES(?, ?, ?, ?)", [row.id, row.day, row.class, row.wins], function(tx, rs) {
            var index = window.classMap[row.class];
            if (row.id == arenaData.trend.end) {
                arenaData.classNums[index] += 1;
                arenaData.classWins[index] += row.wins;
                arenaData.totalWins += row.wins;
                arenaData.totalNums++;
                arenaData.trend.end++;
            } else {
                arenaData.classWins[index] -= arenaData.wins[row.id-1].wins;
                arenaData.classWins[index] += row.wins;
                arenaData.totalWins -= arenaData.wins[row.id-1].wins;
                arenaData.totalWins += row.wins;
            }
            arenaData.wins[row.id-1] = row.wins;
            arenaData.rows[row.id-1] = row;
            refreshCharts();
        }, onSqlError);
    });
}

function deleteArenaRecord(row) {
    // only the last row can be deleted
    if (row.id != arenaData.trend.end - 1) {
        alert("invalid row.id=" + row.id);
        return;
    }
    db.transaction(function(tx) {
        tx.executeSql("DELETE FROM arena WHERE id = ?", [row.id], function(tx, rs) {
            var index = window.classMap[row.class];
            arenaData.classNums[index] -= 1;
            arenaData.classWins[index] -= row.wins;
            arenaData.totalNums--;
            arenaData.totalWins -= row.wins;
            if (row.id == arenaData.trend.end-1) {
                arenaData.trend.end--;
            }
            arenaData.wins.splice(row.id - arenaData.trend.start, 1);
            arenaData.rows.splice(row.id - arenaData.trend.start, 1);
            refreshCharts();
        }, onSqlError);
    });
}

/*
   rows: object list
   {
       id: integer
       day: string
       counts: integer list, length = 2*qualities
       tips: string list, length = 2*qualities
       dust: integer
    }
   sums: list for all 8 kinds of cards
*/
var packsData;

function loadPacksData() {
    packsData = window.packsData = {};
    packsData.rows = [];
    packsData.sums = [0, 0, 0, 0, 0, 0, 0, 0];
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM packs", [], function(tx, rs) {
            for (var i = 0; i < rs.rows.length; i++) {
                var row = rs.rows.item(i);
                var rowData = {};

                rowData.id = row.id;
                rowData.day = row.day;
                rowData.counts = [row.count_gl, row.count_ge, row.count_gr, row.count_gc, row.count_l, row.count_e, row.count_r, row.count_c];
                rowData.counts.map(function(x, p) {
                    if (i == 0) packsData.sums[p] = x; else packsData.sums[p] += x;
                });
                rowData.tips = [row.tip_gl, row.tip_ge, row.tip_gr, row.tip_gc, row.tip_l, row.tip_e, row.tip_r, row.tip_c];
                rowData.dust = row.dust;
                packsData.rows.push(rowData);
            }
            refreshPacksTable();
        }, onSqlError);
    });
}

function insertPacksData(row) {
    db.transaction(function(tx) {
        var lst = [];
        lst.push(row.id);
        lst.push(row.day);
        row.counts.map(function(x) { lst.push(x); });
        row.tips.map(function(x) {lst.push(x); });
        lst.push(row.dust);
        tx.executeSql("INSERT INTO packs VALUES(?,?, ?,?,?,?,?,?,?,?, ?,?,?,?,?,?,?,?, ?)", lst, function(tx, rs) {
            packsData.rows.push(row);
            for (var i = 0; i < packsData.sums.length; i++) {
                //FIXME: ugly codes
                packsData.sums[i] += row[i+2];
            };
            refreshPacksTable();
        }, onSqlError);
    });
}

function deletePacksData(row) {
    db.transaction(function(tx) {
        tx.executeSql("DELETE FROM packs WHERE id = ?", [row.id], function(tx, rs) {
            packsData.rows.splice(packsData.rows.length-1, 1);
            for (var i = 0; i < packsData.sums.length; i++) {
                packsData.sums[i] -= row[i];
            };
            refreshPacksTable();
        }, onSqlError);
    });
}

function onSqlError(tx, error) {
    alert("[onSqlError]" + error.message);
}
