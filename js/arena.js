function ArenaPage() {
    PageBase.apply(this);
}

ArenaPage.prototype = {
    _initMember: function() {
        this._dbConn = new DbConn();

        this.trendChartDomEle = document.getElementById("trend-chart");
        this.winsChartDomEle = document.getElementById("wins-chart");
        this.ratesChartDomEle = document.getElementById("rates-chart");
        this.arenaTableDomEle = document.getElementById("arena-table");

        this.addButtonDomEle = document.getElementById("add-btn");
        this.delButtonDomEle = document.getElementById("del-btn");

        /*
            The following fields may be set by member functions
                this.arenaData
                this.trendObj, this.winsObj, this.ratesObj
        */
    },
    _initData: function() {
        this._dbConn.loadArenaData(this);
    },
    _initView: function() {
        // do nothing
    },
    _initEventHandler: function() {
        var page = this;
        this.addButtonDomEle.onclick = function() {
            var row = {};
            row.id = parseInt(document.getElementById("edit-id").value);
            row.day = document.getElementById("edit-day").value;
            row.class = document.getElementById("edit-class").value;
            row.wins = parseInt(document.getElementById("edit-wins").value);
            page._dbConn.insertArenaRecord(page, row);
        };
        this.delButtonDomEle.onclick = function() {
            page._dbConn.deleteArenaRecord(page, page.arenaData.rows[page.arenaData.rows.length-1]);
        };
    },

    _showArenaTrend: function(container, lineTicks, winData) {
        var lineOptions = {
            axis: {
                x: {
                    tickWidth: 20,
                    ticks: lineTicks,
                },
                y: {
                    min: 0,
                    max: 11,
                    total: 11,
                    tickSize: 2,
                    tickWidth: 20,
                    rotate: 90,
                },
            },
            line: {
                dots: true,
                dotRadius: 6,
            },
            icons: {
                0: "circle",
            },
            legend: {
                position: ["right", "center"],
                borderColor: "white",
            },
        };
        var arenaData = this.arenaData;
        var seriesName = "totalNums = " + arenaData.totalNums
            + "\ntotalWins = " + arenaData.totalWins
            + "\ntotalAvg = " + ((arenaData.totalNums == 0) ? 0 : (arenaData.totalWins/arenaData.totalNums).toFixed(2));
        var lineData = [{name: seriesName, data: winData}];
        var line = new Venus.SvgChart(container, lineData, lineOptions);
        return line;
    },
    _showClassWins: function(container, winData) {
        var barTicks = CardsInfo.classNames;
        var barOptions = {
            axis: {
                x: {
                    total: 9,
                    tickWidth: 60,
                    ticks: barTicks,
                    labelRotate: 30,
                },
                y: {
                    min: 0,
                    max: 11,
                    total: 11,
                    tickSize: 2,
                    tickWidth: 16,
                    rotate: 90,
                },
            },
            bar: {
                radius: 0,
            },
        };
        var arr = {};
        for (var i = 0; i < barTicks.length; i++) {
            arr[barTicks[i]] = winData[i];
        }
        var barData = [{name: 0, data: arr}];
        var bar = new Venus.SvgChart(container, barData, barOptions);
        return bar;
    },
    _showClassRates: function(container, playData) {
        var pieOptions = {
            height: 200,
            pie: {
                radius: 60, 
            },
        };
        var pieData = [];
        for (var i = 0; i < CardsInfo.classNames.length; i++) {
            pieData.push({name: CardsInfo.classNames[i], data: playData[i]});
        }
        pieData.sort(function(a, b) {
            return b.data - a.data;
        });
        var pie = new Venus.SvgChart(container, pieData, pieOptions);
        return pie;
    },

    refreshTrendChart: function() {
        if (this.trendObj) this.trendObj.destroy();

        var trendTicks = [];
        var trendData = [];
        var arenaData = this.arenaData;
        for (var i = arenaData.trend.start; i < arenaData.trend.end; i++) {
            trendTicks.push(i);
            trendData.push(arenaData.wins[i-arenaData.trend.start]);
        }
        this.trendObj = this._showArenaTrend(this.trendChartDomEle, trendTicks, trendData);
    },
    refreshWinsChart: function() {
        if (this.winsObj) this.winsObj.destroy();

        var winsData = [];
        var arenaData = this.arenaData;
        for (var i = 0; i < CardsInfo.classNames.length; i++) {
            winsData.push((arenaData.classNums[i] == 0) ? 0: (arenaData.classWins[i]/arenaData.classNums[i]).toFixed(2));
        }
        this.winsObj = this._showClassWins(this.winsChartDomEle, winsData);
    },
    refreshRatesChart: function() {
        if (this.ratesObj) this.ratesObj.destroy();

        var arenaData = this.arenaData;
        this.ratesObj = this._showClassRates(this.ratesChartDomEle, arenaData.classNums);
    },
    refreshEditRow: function() {
        var tdId = document.getElementById("edit-id");
        var tdDay = document.getElementById("edit-day");
        var tdClass = document.getElementById("edit-class");
        var tdWins = document.getElementById("edit-wins");

        tdId.value = this.arenaData.trend.end;

        var today = new Date();
        var month = today.getMonth()+1; // the special one
        tdDay.value = today.getFullYear() + "-" 
            + ((month>9) ? month : ("0"+month)) + "-"
            + ((today.getDate()>9) ? today.getDate() : ("0"+today.getDate()));

        if (tdClass.length == 0) {
            CardsInfo.classNames.map(function(name) {
                var op = document.createElement("option");
                op.value = name;
                op.text = name;
                tdClass.add(op);
            });
        }
        tdWins.value = 0;
    },
    refreshArenaTable: function() {
        var rows = this.arenaData.rows;
        var tbl = document.createElement("table");
        for (var i = rows.length-1; i >= 0; i--) {
            var row = rows[i];
            var tr = document.createElement("tr");
            tr.innerHTML = "<td>" + row.id + "</td><td>" + row.day + "</td><td>" + row.class + "</td><td>" + row.wins + "</td>";
            tbl.appendChild(tr);
        }

        this.arenaTableDomEle.innerHTML = "";
        this.arenaTableDomEle.appendChild(tbl);

        this.refreshEditRow();
    },
    refreshCharts: function() {
        this.refreshTrendChart();
        this.refreshWinsChart();
        this.refreshRatesChart();
        this.refreshArenaTable();
    },
}