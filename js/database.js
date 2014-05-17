/*
   Database location:
       Windows Vista or 7: \Users\_username_\AppData\Local\Google\Chrome\User Data\Default\databases
       Windows XP: \Documents and Settings\_username_\Local Settings\Application Data\Google\Chrome\User Data\Default\databases
       Mac OS X: ~/Library/Application Support/Google/Chrome/Default/databases
       Linux: ~/.config/google-chrome/Default/databases
*/
function DbConn() {
    this._db = openDatabase("hsdb", "1.0", "HearthStone Records", "4096");
}

DbConn.prototype = {
    _onSqlError: function(tx, error) {
        alert("[onSqlError]" + error.message);
    },

    initDB: function() {
        this._db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS arena(id integer PRIMARY KEY UNIQUE,day date,class varchar,wins integer)", [], undefined, this._onSqlError);
            tx.executeSql("CREATE TABLE IF NOT EXISTS packs(id integer PRIMARY KEY UNIQUE,day date,count_gl integer,count_ge integer,count_gr integer,count_gc integer,count_l integer,count_e integer,count_r integer,count_c integer,tip_gl text,tip_ge text,tip_gr text,tip_gc text,tip_l text,tip_e text,tip_r text,tip_c text,dust integer)", [], undefined, this._onSqlError);
        });
    },

    loadArenaData: function(page) {
        /*
            classWins: [int], list of total wins grouped by classes
            classNums: [int], list of played games grouped by classes
            rows: [rowObject], list of database rows
            trend: object
                start: int, the first shown arena record id
                end: int, the last shown arena record id *PLUS* one
            wins: [int], list of wins
            totalWins: int, total wins
            totalNums: int, total played
        */
        var arenaData = page.arenaData = {};
        arenaData.trend = {};
        this._db.transaction(function(tx) {
            tx.executeSql("SELECT class, count(id) as nums, sum(wins) as wins FROM arena GROUP BY class", [], function(tx, rs) {
                arenaData.classNums = [];
                arenaData.classWins = [];
                arenaData.totalWins = 0;
                for (var i = 0; i < CardsInfo.classNames.length; i++) {
                    arenaData.classNums.push(0);
                    arenaData.classWins.push(0);
                };
                for (var i = 0; i < rs.rows.length; i++) {
                    var index = CardsInfo.classMap[rs.rows.item(i).class];
                    arenaData.classNums[index] = rs.rows.item(i).nums;
                    arenaData.classWins[index] = rs.rows.item(i).wins;
                    arenaData.totalWins += rs.rows.item(i).wins;
                }
                page.refreshRatesChart();
                page.refreshWinsChart();
            }, this._onSqlError);
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
                page.refreshTrendChart();
                page.refreshArenaTable();
            }, this._onSqlError);
        });
    },
    insertArenaRecord: function(page, row) {
        var arenaData = page.arenaData;
        // only the exsited rows can be modified or insert at the end
        if (row.id < arenaData.trend.start - 1
            || row.id > arenaData.trend.end) {
            alert("invalid row.id=" + row.id);
            return;
        }
        this._db.transaction(function(tx) {
            tx.executeSql("INSERT INTO arena(id, day, class, wins) VALUES(?, ?, ?, ?)", [row.id, row.day, row.class, row.wins], function(tx, rs) {
                var index = CardsInfo.classMap[row.class];
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
                page.refreshCharts();
            }, this._onSqlError);
        });
    },
    deleteArenaRecord: function(page, row) {
        var arenaData = page.arenaData;
        // only the last row can be deleted
        if (row.id != arenaData.trend.end - 1) {
            alert("invalid row.id=" + row.id);
            return;
        }
        this._db.transaction(function(tx) {
            tx.executeSql("DELETE FROM arena WHERE id = ?", [row.id], function(tx, rs) {
                var index = CardsInfo.classMap[row.class];
                arenaData.classNums[index] -= 1;
                arenaData.classWins[index] -= row.wins;
                arenaData.totalNums--;
                arenaData.totalWins -= row.wins;
                if (row.id == arenaData.trend.end-1) {
                    arenaData.trend.end--;
                }
                arenaData.wins.splice(row.id - arenaData.trend.start, 1);
                arenaData.rows.splice(row.id - arenaData.trend.start, 1);
                page.refreshCharts();
            }, this._onSqlError);
        });
    },

    loadPacksData: function(page) {
        /*
            rows: [object]
                id: int
                day: string
                counts: [int], length = 2*qualities
                tips: [string], length = 2*qualities
                dust: int
            sums: [int], list for all 8 kinds of cards
        */
        var packsData = page.packsData = {};
        packsData.rows = [];
        packsData.sums = [0, 0, 0, 0, 0, 0, 0, 0];
        this._db.transaction(function(tx) {
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
                page.refreshCharts();
            }, this._onSqlError);
        });
    },
    insertPacksData: function(page, row) {
        var packsData = page.packsData;
        this._db.transaction(function(tx) {
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
                    packsData.sums[i] += lst[i+2];
                };
                page.refreshCharts();
            }, this._onSqlError);
        });
    },
    deletePacksData: function(page, row) {
        var packsData = page.packsData;
        this._db.transaction(function(tx) {
            tx.executeSql("DELETE FROM packs WHERE id = ?", [row.id], function(tx, rs) {
                packsData.rows.splice(packsData.rows.length-1, 1);
                for (var i = 0; i < packsData.sums.length; i++) {
                    packsData.sums[i] -= row[i];
                };
                page.refreshCharts();
            }, this._onSqlError);
        });
    } 
}