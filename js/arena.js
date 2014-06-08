function ArenaPage(container) {
    PageBase.apply(this, arguments);
}

ArenaPage.prototype = {
    _initView: function() {
        var page = this;        
        this.bottomDomEle.style.top = (this.container.offsetTop + this.trendChartDomEle.offsetHeight) + "px";
        this.pieAreaDomEle.style.top = this.winsChartDomEle.offsetHeight + "px";
        CardsInfo.classNames.map(function(name) {
            var op = document.createElement("option");
            op.value = name;
            op.text = name;
            page.editClassDomEle.add(op);
        });
        this.arenaTableDomEle.style.top = (this.addButtonDomEle.offsetHeight + this.fixedTableDomEle.offsetHeight) + "px";
    },
    _initMember: function() {
        this._dbConn = new DbConn();
        this.container.innerHTML = HtmlTemplate.getTemplate("arena");
        
        this.bottomDomEle = document.getElementById("arena-bottom");

        this.trendChartDomEle = document.getElementById("trend-chart");
        this.winsChartDomEle = document.getElementById("wins-chart");
        this.pieAreaDomEle = document.getElementById("arena-pie");
        this.ratesChartDomEle = document.getElementById("rates-chart");
        this.pieWinsDomEle = document.getElementById("pie-wins");
        this.arenaTableDomEle = document.getElementById("arena-table");
        this.fixedTableDomEle = document.getElementById("arena-fixed");

        this.addButtonDomEle = document.getElementById("add-btn");
        this.delButtonDomEle = document.getElementById("del-btn");

        this.editIdDomEle = document.getElementById("edit-id");
        this.editDayDomEle = document.getElementById("edit-day");
        this.editClassDomEle = document.getElementById("edit-class");
        this.editWinsDomEle = document.getElementById("edit-wins");

        /*
            The following fields may be set by member functions
                this.arenaData
                this.trendObj, this.winsObj, this.ratesObj
        */
    },
    _initData: function() {
        this._dbConn.loadArenaData(this);
    },
    _initEventHandler: function() {
        var page = this;
        this.addButtonDomEle.onclick = function() {
            var row = {};
            row.id = parseInt(page.editIdDomEle.value);
            row.day = page.editDayDomEle.value;
            row.class = page.editClassDomEle.value;
            row.wins = parseInt(page.editWinsDomEle.value);
            page._dbConn.insertArenaRecord(page, row);
        };
        this.delButtonDomEle.onclick = function() {
            page._dbConn.deleteArenaRecord(page, page.arenaData.rows[page.arenaData.rows.length-1]);
        };
    },

    _showArenaTrend: function(container, lineTicks, winData, ythres, seriesName) {
        var lineOptions = {
            axis: {
                x: {
                    tickWidth: 20,
                    ticks: lineTicks,
                },
                y: {
                    min: 0,
                    max: 11, // if not set, empty input will cause the chart library to crash
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
            threshold: {
                y: {
                    value: ythres,
                },
            },
        };
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
    _showClassRates: function(container, nameList, dataList) {
        // avoid the chart library to crash
        if (eval(dataList.join("+")) == 0) return null;

        var pieOptions = {
            pie: {
                radius: 60, 
                rotate: 45, 
            },
        };
        var pieData = [];
        for (var i = 0; i < nameList.length; i++) {
            pieData.push({name: nameList[i], data: dataList[i]});
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

        var totalAvg = (arenaData.totalNums == 0) ? 0 : (arenaData.totalWins/arenaData.totalNums).toFixed(2);
        var totalMsg = "totalNums = " + arenaData.totalNums
            + "\ntotalWins = " + arenaData.totalWins
            + "\ntotalAvg = " + totalAvg;

        this.trendObj = this._showArenaTrend(this.trendChartDomEle, trendTicks, trendData, totalAvg, totalMsg);

        // highlight 12 wins
        var circles = $(this.trendChartDomEle).find("circle");
        circles.map(function(i, ele) {
            // FIXME: hardcard the cy filter
            if (ele.getAttribute("cy") != "20") return;
            ele.onclick && ele.onclick();
        });
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
        if (this.pieWinsObj) this.pieWinsObj.destroy();

        var arenaData = this.arenaData;
        this.ratesObj = this._showClassRates(this.ratesChartDomEle, CardsInfo.classNames, arenaData.classNums);

        var winNames = [];
        for (var i = 0; i <= 12; i++) {
            winNames.push(i);
        }
        this.pieWinsObj = this._showClassRates(this.pieWinsDomEle, winNames, arenaData.winNums);
    },
    refreshEditRow: function() {
        this.editIdDomEle.value = this.arenaData.trend.end;

        var today = new Date();
        var month = today.getMonth()+1; // the special one
        this.editDayDomEle.value = today.getFullYear() + "-" 
            + ((month>9) ? month : ("0"+month)) + "-"
            + ((today.getDate()>9) ? today.getDate() : ("0"+today.getDate()));

        this.editWinsDomEle.value = 0;
    },
    refreshArenaTable: function() {
        var rows = this.arenaData.rows;
        var tbl = document.createElement("table");
        tbl.className = "table-fixed";
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