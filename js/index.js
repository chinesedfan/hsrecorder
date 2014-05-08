var trendObj, winsObj, ratesObj;

/*
   classWins: list of total wins grouped by classes
   classNums: list of played games grouped by classes
   rows: list of database rows
   trend: 
       start: the first shown arena record id
       end: the last shown arena record id *PLUS* one
   wins: list of wins
*/
var arenaData = window.arenaData;

function refreshTrendChart() {
    if (trendObj) trendObj.destroy();

    var trendChart = document.getElementById("trend-chart");
    var trendTicks = [];
    var trendData = [];
    for (var i = arenaData.trend.start; i < arenaData.trend.end; i++) {
        trendTicks.push(i);
        trendData.push(arenaData.wins[i-arenaData.trend.start]);
    }
    trendObj = showArenaTrend(trendChart, trendTicks, trendData);
}

function refreshWinsChart() {
    if (winsObj) winsObj.destroy();

    var winsChart = document.getElementById("wins-chart");
    var winsData = [];
    for (var i = 0; i < window.classNames.length; i++) {
        winsData.push((arenaData.classNums[i] == 0) ? 0: (arenaData.classWins[i]/arenaData.classNums[i]).toFixed(2));
    }
    winsObj = showClassWins(winsChart, winsData);
}

function refreshRatesChart() {
    if (ratesObj) ratesObj.destroy();

    var ratesChart = window.document.getElementById("rates-chart");
    ratesObj = showClassRates(ratesChart, arenaData.classNums);
}

function refreshEditRow() {
    var tdId = document.getElementById("edit-id");
    var tdDay = document.getElementById("edit-day");
    var tdClass = document.getElementById("edit-class");
    var tdWins = document.getElementById("edit-wins");

    tdId.value = arenaData.trend.end;

    var today = new Date();
    var month = today.getMonth()+1; // the special one
    tdDay.value = today.getFullYear() + "-" 
        + ((month>9) ? month : ("0"+month)) + "-"
        + ((today.getDate()>9) ? today.getDate() : ("0"+today.getDate()));

    if (tdClass.length == 0) {
        window.classNames.map(function(name) {
            var op = document.createElement("option");
            op.value = name;
            op.text = name;
            tdClass.add(op);
        });
    }
    tdWins.value = 0;
}

function refreshArenaTable() {
    var rows = arenaData.rows;
    var tbl = document.createElement("table");
    for (var i = rows.length-1; i >= 0; i--) {
        var row = rows[i];
        var tr = document.createElement("tr");
        tr.innerHTML = "<td>" + row.id + "</td><td>" + row.day + "</td><td>" + row.class + "</td><td>" + row.wins + "</td>";
        tbl.appendChild(tr);
    }

    var arenaTable = document.getElementById("arena-table");
    arenaTable.innerHTML = "";
    arenaTable.appendChild(tbl);

    refreshEditRow();
}

function refreshCharts() {
    refreshTrendChart();
    refreshWinsChart();
    refreshRatesChart();
    refreshArenaTable();
}

window.onload = function() {
    initDB();
    loadArenaData();

    document.getElementById("add-btn").onclick = function() {
        var row = {};
        row.id = parseInt(document.getElementById("edit-id").value);
        row.day = document.getElementById("edit-day").value;
        row.class = document.getElementById("edit-class").value;
        row.wins = parseInt(document.getElementById("edit-wins").value);
        insertArenaRecord(row);
    };
    document.getElementById("del-btn").onclick = function() {
        deleteArenaRecord(arenaData.rows[arenaData.rows.length-1]);
    };
};
