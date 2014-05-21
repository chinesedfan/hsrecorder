function ArenaPage(container) {
    PageBase.apply(this, arguments);
}

ArenaPage.prototype = {
    _initView: function() {
        // this page includes the trend chart and the bottom part
        var trendChartDomEle = document.createElement("div");
        trendChartDomEle.id = "trend-chart";
        trendChartDomEle.className = "chart center";
        this.container.appendChild(trendChartDomEle);
        
        var bottomDomEle = document.createElement("div");
        bottomDomEle.className = "bottom";
        this.container.appendChild(bottomDomEle);

        // the bottom part includes the left part and the right part
        var leftBottomDomEle = document.createElement("div");
        leftBottomDomEle.className = "half";
        bottomDomEle.appendChild(leftBottomDomEle);

        var rightBottomDomEle = document.createElement("div");
        rightBottomDomEle.className = "half";
        bottomDomEle.appendChild(rightBottomDomEle);

        // the left bottom part includes two charts
        var winsChartDomEle = document.createElement("div");
        winsChartDomEle.id = "wins-chart";
        winsChartDomEle.className = "chart";
        leftBottomDomEle.appendChild(winsChartDomEle);

        var ratesChartDomEle = document.createElement("div");
        ratesChartDomEle.id = "rates-chart";
        ratesChartDomEle.className = "chart";
        leftBottomDomEle.appendChild(ratesChartDomEle);

        // the right bottom part includes the button area, the fixed table and the real arena table
        var buttonAreaDomEle = document.createElement("div");
        rightBottomDomEle.appendChild(buttonAreaDomEle);

        var fixedTableDomEle = document.createElement("table");
        rightBottomDomEle.appendChild(fixedTableDomEle);

        var arenaTableDomEle = document.createElement("div");
        arenaTableDomEle.id = "arena-table";
        rightBottomDomEle.appendChild(arenaTableDomEle);

        // the button area include two buttons
        var addButtonDomEle = document.createElement("button");
        addButtonDomEle.id = "add-btn";
        addButtonDomEle.className = "half";
        addButtonDomEle.innerHTML = "Add Editing";
        buttonAreaDomEle.appendChild(addButtonDomEle);

        var delButtonDomEle = document.createElement("button");
        delButtonDomEle.id = "del-btn";
        delButtonDomEle.className = "half";
        delButtonDomEle.innerHTML = "Remove Last";
        buttonAreaDomEle.appendChild(delButtonDomEle);

        // the fixed table includes its head row and the edit row
        var headTrDomEle = document.createElement("tr");
        headTrDomEle.innerHTML = "<th>id</th><th>day</th><th>class</th><th>wins</th>";
        fixedTableDomEle.appendChild(headTrDomEle);

        var editRowDomEle = document.createElement("tr");
        editRowDomEle.id = "edit-row";
        fixedTableDomEle.appendChild(editRowDomEle);

        // the edit row includes 4 cells, and each cell incldes an input or select element
        var td, input, select;
        td = document.createElement("td");
        input = document.createElement("input");
        input.id = "edit-id";
        td.appendChild(input);
        editRowDomEle.appendChild(td);

        td = document.createElement("td");
        input = document.createElement("input");
        input.id = "edit-day";
        td.appendChild(input);
        editRowDomEle.appendChild(td);

        td = document.createElement("td");
        select = document.createElement("select");
        select.id = "edit-class";
        CardsInfo.classNames.map(function(name) {
            var op = document.createElement("option");
            op.value = name;
            op.text = name;
            select.add(op);
        });
        td.appendChild(select);
        editRowDomEle.appendChild(td);

        td = document.createElement("td");
        input = document.createElement("input");
        input.id = "edit-wins";
        td.appendChild(input);
        editRowDomEle.appendChild(td);

        // set css style at last
        $("input").map(function(i, domEle) { domEle.className = "form-control"; });
        $("select").map(function(i, domEle) { domEle.className = "form-control"; });
        $("button").map(function(i, domEle) { domEle.className = "btn btn-default col-md-6"; });                 
    },
    _initMember: function() {
        this._dbConn = new DbConn();

        this.trendChartDomEle = document.getElementById("trend-chart");
        this.winsChartDomEle = document.getElementById("wins-chart");
        this.ratesChartDomEle = document.getElementById("rates-chart");
        this.arenaTableDomEle = document.getElementById("arena-table");

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

    _showArenaTrend: function(container, lineTicks, winData) {
        var arenaData = this.arenaData;
        var totalAvg = (arenaData.totalNums == 0) ? 0 : (arenaData.totalWins/arenaData.totalNums).toFixed(2);
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
                    value: totalAvg,
                },
            },
        };
        var seriesName = "totalNums = " + arenaData.totalNums
            + "\ntotalWins = " + arenaData.totalWins
            + "\ntotalAvg = " + totalAvg;
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
        // avoid the chart library to crash
        if (eval(playData.join("+")) == 0) return null;

        var pieOptions = {
            height: 200,
            pie: {
                radius: 60, 
            },
        };
        var pieData = [];
        var sum = 0;
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