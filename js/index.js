window.onload = function() {
    var trendChart = document.getElementById("trend-chart");
    showArenaTrend(trendChart, [1,2,3,4,5,6,7,8,9,10,11,12],
        [1,2,3,4,5,6,7,8,9,1,2,3]);

    var winsChart = document.getElementById("wins-chart");
    showClassWins(winsChart, [12,2,3,4,5,6,7,8,9]);

    var ratesChart = window.document.getElementById("rates-chart");
    showClassRates(ratesChart, [12,2,3,4,5,6,7,8,9]);

    var arenaTable = document.getElementById("arena-table");
    initDB();
    loadArenaData(arenaTable);
};
