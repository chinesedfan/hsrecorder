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

function onSqlError(tx, error) {
    alert(error.message);
}
