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

function loadArenaData(container) {
    var arenaData = window.arenaData = {};
    arenaData.trend = {};
    db.transaction(function(tx) {
        tx.executeSql("SELECT class, sum(wins) as wins FROM arena GROUP BY class", [], function(tx, rs) {
            var temp = {};
            for (var i = 0; i < rs.rows.length; i++) {
                temp[rs.rows.item(i).class] = rs.rows.item(i).wins;
            }
            arenaData.classWins = []; 
            for (var i = 0; i < window.classNames.length; i++) {
                 arenaData.classWins.push(temp[window.classNames[i]]);
            }
            refreshWinsChart();
        }, onSqlError);
        tx.executeSql("SELECT class, count(id) as nums FROM arena GROUP BY class", [], function(tx, rs) {
            var temp = {};
            for (var i = 0; i < rs.rows.length; i++) {
                temp[rs.rows.item(i).class] = rs.rows.item(i).nums;
            }
            arenaData.classNums = []; 
            for (var i = 0; i < window.classNames.length; i++) {
                 arenaData.classNums.push(temp[window.classNames[i]] ?
                     temp[window.classNames[i]] : 0);
            }
            refreshRatesChart();
        }, onSqlError);
        tx.executeSql("SELECT wins FROM arena", [], function(tx, rs) {
            arenaData.wins = [];
            for (var i = 0; i < rs.rows.length; i++) {
                arenaData.wins.push(rs.rows.item(i).wins);
            }
            if (!arenaData.trend.start) {
                arenaData.trend.start = 0;
                arenaData.trend.end = rs.rows.length;
            }
            refreshTrendChart();
        }, onSqlError);
        tx.executeSql("SELECT id, day, class, wins FROM arena", [], function(tx, rs) {
            arenaData.rows = rs.rows;
            refreshArenaTable();
        }, onSqlError);
    });
}

function onSqlError(tx, error) {
    alert(error.message);
}
