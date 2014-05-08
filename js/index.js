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
    if (trendObj) trendObj.destory();

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
    if (winsObj) winsObj.destory();

    var winsChart = document.getElementById("wins-chart");
    var winsData = [];
    for (var i = 0; i < window.classNames.length; i++) {
        winsData.push((arenaData.classNums[i] == 0) ? 0: (arenaData.classWins[i]/arenaData.classNums[i]).toFixed(2));
    }
    winsObj = showClassWins(winsChart, winsData);
}

function refreshRatesChart() {
    if (ratesObj) ratesObj.destory();

    var ratesChart = window.document.getElementById("rates-chart");
    ratesObj = showClassRates(ratesChart, arenaData.classNums);
}

function refreshArenaTable() {
    var rows = arenaData.rows;
    var tbl = document.createElement("table");
    for (var i = 0; i < rows.length; i++) {
        var row = rows.item(i);
        var tr = document.createElement("tr");
        tr.innerHTML = "<td>" + row.id + "</td><td>" + row.day + "</td><td>" + row.class + "</td><td>" + row.wins + "</td>";
        tbl.appendChild(tr);
    }

    var arenaTable = document.getElementById("arena-table");
    arenaTable.childNodes = null;
    arenaTable.appendChild(tbl);
}

window.onload = function() {
    initDB();
    loadArenaData();
};
