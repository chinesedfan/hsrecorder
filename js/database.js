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
    db.transaction(function(tx) {
        tx.executeSql("SELECT id, day, class, wins FROM arena", [], function(tx, rs) {
            var tbl = document.createElement("table");
            var tr = document.createElement("tr");
            tr.innerHTML = "<th>id</th><th>day</th><th>class</th><th>wins</th>";
            tbl.appendChild(tr);
            for (var i = 0; i < rs.rows.length; i++) {
                var row = rs.rows.item(i);
                tr = document.createElement("tr");
                tr.innerHTML = "<td>" + row.id + "</td><td>" + row.day + "</td><td>" + row.class + "</td><td>" + row.wins + "</td>";
                tbl.appendChild(tr);
            }
            container.appendChild(tbl);
        }, onSqlError);
    });
}

function onSqlError(tx, error) {
    alert(error.message);
}
