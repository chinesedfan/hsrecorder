/* class PacksPage begin */
function PacksPage(container) {
    PageBase.apply(this, arguments);
}

PacksPage.prototype = {
    _initView: function() {
        var page = this;
        this.bottomJqEle.css("top", (this.container.offsetTop + this.trendChartDomEle.offsetHeight) + "px");
        this.ratesChartDomEle.style.top = this.countsChartDomEle.offsetHeight + "px";

        // the fixed table includes its head row and the edit row
        var headRowJqEle = $("<tr/>", {
                id: "packs-thead"
            }).appendTo(this.fixedTableJqEle),
            texts = ["id", "day"];
        CardsInfo.qualityList.map(function(q) { texts.push(q.name[0]); });
        CardsInfo.qualityList.map(function(q) { texts.push("G-" + q.name[0]); });        
        texts.push("dust");
        texts.map(function(t) {
            $("<td/>", {
                "class": t == "day" ? "datetd" : "othertd",
                text: t
            }).appendTo(headRowJqEle);
        });

        var editingRowJqEle = $("<tr/>", {
                id: "packs-edit"
            }).appendTo(this.fixedTableJqEle),
            cellids = ["packs-id", "packs-day"];
        CardsInfo.qualityList.map(function(q) { cellids.push("normal-" + q.color); });
        CardsInfo.qualityList.map(function(q) { cellids.push("golden-" + q.color); });        
        cellids.push("packs-dust");
        cellids.map(function(c) {
            var td = $("<td/>", {
                "class": c == "packs-day" ? "datetd" : "othertd"
            }).appendTo(editingRowJqEle);
            // the first two own an inner input box
            if (c == "packs-id" || c == "packs-day") {
                $("<input/>", {
                    id: c,
                    "class": "form-control"
                }).appendTo(td);
            } else {
                td.attr("id", c);
            }
        });

        this.tableHeaderJqEle = $("#packs-thead");
        this.editingRowJqEle = $("#packs-edit");

        this.editIdJqEle = $("#packs-id");
        this.editDayJqEle = $("#packs-day");
        this.editingCellCJqEle = $("#normal-black");
        this.editingCellDustJqEle = $("#packs-dust");

        this.packsTableJqEle.css("top", (this.goldenButtonJqEle.outerHeight() + this.addButtonJqEle.outerHeight() + this.fixedTableJqEle.height()) + "px");
    },
    _initMember: function() {
        this._dbConn = new DbConn();
        this.container.innerHTML = HtmlTemplate.getTemplate("packs");

        this.bottomJqEle = $("#packs-bottom");
        
        this.goldenButtonJqEle = $("#golden-btn");
        this.cardInputJqEle = $("#card-input");
        this.autoInputJqEle = $("#auto-input");
        this.appendButtonJqEle = $("#append-btn");

        this.addButtonJqEle = $("#packs-add");
        this.delButtonJqEle = $("#packs-del");

        this.fixedTableJqEle = $("#packs-fixed");
        this.packsTableJqEle = $("#packs-table");

        this.trendChartDomEle = document.getElementById("packs-trend");
        this.countsChartDomEle = document.getElementById("quality-parts");
        this.ratesChartDomEle = document.getElementById("quality-rates");

        this.autoInputObj = new AutoInput(this.cardInputJqEle, this.autoInputJqEle);

        /*
            The following fields may be set by member functions
                this.packsData
                this.trendObj, this.numsObj, this.ratesObj
        */
    },
    _initData: function() {
        this._dbConn.loadPacksData(this);
    },
    _initEventHandler: function() {
        var page = this;
        this.goldenButtonJqEle.toggle(
            // toggle this button between golden and normal
            function() {
                var btn = $(this);
                btn.text("Golden");
                btn.css("background-color", "#ffff00");
            },
            function() {
                var btn = $(this);
                btn.text("Normal");
                btn.css("background-color", "#fff");
            }
        );
        this.appendButtonJqEle.click(function () {
            // verfiy the input
            var curLabelDomEle = page.autoInputObj.getSelectedLabelDomEle();
            if (!curLabelDomEle || curLabelDomEle.innerHTML != page.cardInputJqEle.val()) return;
            // update numbers in the editing row
            var prefix = page.goldenButtonJqEle.text().toLowerCase();
            var cell = $("#" + prefix + "-" + curLabelDomEle.style.color);
            var count = parseInt(cell.text());
            if (count == 5) return;
            cell.text(count+1);
            var tip = cell.attr("title");
            cell.attr("title", tip ? tip + "\n" + curLabelDomEle.innerHTML : curLabelDomEle.innerHTML);
            // update the normal common cell
            page.editingCellCJqEle.text(parseInt(page.editingCellCJqEle.text()) - 1);
            // update the dust
            cell = page.editingCellDustJqEle;
            count = parseInt(cell.text()) - 5; // to replace a normal common
            var index = curLabelDomEle.getAttribute(page.autoInputObj.QUALITY_INDEX);
            if (prefix == "golden") {
                cell.text(count + CardsInfo.qualityList[index].gdust);
            } else {
                cell.text(count + CardsInfo.qualityList[index].dust);
            }
        });

        this.addButtonJqEle.click(function() {
            var row = {};
            row.counts = [];
            row.tips = [];

            var i = 0; 
            var tdDomEleList = page.editingRowJqEle.children();
            // remember they have an inner input box
            row.id = parseInt(tdDomEleList.get(i++).children[0].value);
            row.day = tdDomEleList.get(i++).children[0].value;

            // [0, len - 1] -> [len, 2*len - 1], [len, 2*len - 1] -> [0, len - 1]
            for (var j = 0, len = CardsInfo.qualityList.length; j < len; i++, j++) {
                row.counts[j] = parseInt(tdDomEleList.get(i+len).innerHTML);
                row.counts[j+len] = parseInt(tdDomEleList.get(i).innerHTML);

                row.tips[j] = tdDomEleList.get(i+len).title;
                row.tips[j+len] = tdDomEleList.get(i).title;
            };
            row.dust = parseInt(tdDomEleList.get(tdDomEleList.length-1).innerHTML);

            page._dbConn.insertPacksData(page, row);
        });
        this.delButtonJqEle.click(function() {
            var row = {};
            row.id = page.packsData.rows.length;
            page._dbConn.deletePacksData(page, row);
        });
    },

    _showDustTrend: function(container, lineTicks, dustData) {
        if (dustData.length == 0) return null;

        var lineOptions = {
            axis: {
                x: {
                    tickWidth: 20,
                    ticks: lineTicks,
                },
                y: {
                    min: 1,
                    max: 9999,
                    tickSize: 4,
                    tickWidth: 30,
                    rotate: 90,
                    type: "logscale",
                    //logbase: 10,
                },
            },
            line: {
                dots: true,
                dotRadius: 6,
            },
            icons: {
                0: "circle",
            },
            threshold: {
                y: {
                    value: 420,
                },
            },
        };
        var lineData = [{name: 0, data: dustData}];
        var line = new Venus.SvgChart(container, lineData, lineOptions);
        return line;
    },
    _showQualityCounts: function(container, qualityData) {
        if (eval(qualityData.join("+")) == 0) return null;

        var barTicks = CardsInfo.qualityNames;
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
                    tickSize: 2,
                    tickWidth: 16,
                    rotate: 90,
                },
            },
            bar: {
                radius: 0,
            },
        };
        var arr1 = {}, arr2 = {};
        for (var i = 0; i < barTicks.length; i++) {
            arr1[barTicks[i]] = qualityData[i];
            arr2[barTicks[i]] = qualityData[i+barTicks.length];
        }
        var barData = [{name: "golden", data: arr1}, {name: "normal", data: arr2}];
        var bar = new Venus.SvgChart(container, barData, barOptions);
        return bar;
    },
    _showQualityRates: function(container, qualityData) {
        // avoid the chart library to crash
        if (eval(qualityData.join("+")) == 0) return null;

        var pieOptions = {
            pie: {
                radius: 60,
                rotate: 30, 
            },
        };
        var pieData = [];
        for (var i = 0; i < CardsInfo.qualityNames.length; i++) {
            pieData.push({name: "Golden " + CardsInfo.qualityNames[i], data: qualityData[i]});
            pieData.push({name: CardsInfo.qualityNames[i], data: qualityData[i+CardsInfo.qualityNames.length]});
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
        for (var i = 0; i < this.packsData.rows.length; i++) {
            trendTicks.push(i+1);
            trendData.push(this.packsData.rows[i].dust);
        }
        this.trendObj = this._showDustTrend(this.trendChartDomEle, trendTicks, trendData);

        // highlight legendary cards
        var circles = $(this.trendChartDomEle).find("circle");
        this.packsData.oranges.map(function(x) {
            var dom = circles[x-1];
            dom.highlight();
        });
    },
    refreshCountsChart: function() {
        this.countsChartDomEle.innerHTML = "";

        var tbl, tr;
        tbl = $("<table/>", {
            "class": "table table-boarded"
        }).appendTo(this.countsChartDomEle);

        tr = $("<tr><td/><td>Normal</td><td/><td>Golden</td><td/></tr>").appendTo(tbl);
        for (var i = 0; i < CardsInfo.qualityList.length; i++) {
            tr = $("<tr/>").appendTo(tbl);
            // quality name
            $("<td/>", {
                text: CardsInfo.qualityList[i].name,
                css: {color: CardsInfo.qualityList[i].color}
            }).appendTo(tr);
            // normal count
            $("<td/>", {
                text: this.packsData.sums[i+CardsInfo.qualityList.length]
            }).appendTo(tr);
            // normal distance
            $("<td/>", {
                text: "+" + (this.packsData.rows.length - this.packsData.lasts[i+CardsInfo.qualityList.length]),
                css: {color: "red"}
            }).appendTo(tr);
            // golden count
            $("<td/>", {
                text: this.packsData.sums[i]
            }).appendTo(tr);
            // golden distance
            $("<td/>", {
                text: "+" + (this.packsData.rows.length - this.packsData.lasts[i]),
                css: {color: "red"}
            }).appendTo(tr);
        }
    },
    refreshRatesChart: function() {
        if (this.ratesObj) this.ratesObj.destroy();

        this.ratesObj = this._showQualityRates(this.ratesChartDomEle, this.packsData.sums);
    },
    refreshPacksEditRow: function() {
        this.editIdJqEle.val(this.packsData.rows.length + 1);

        var today = new Date();
        var month = today.getMonth()+1; // the special one
        this.editDayJqEle.val(today.getFullYear() + "-" 
            + ((month>9) ? month : ("0"+month)) + "-"
            + ((today.getDate()>9) ? today.getDate() : ("0"+today.getDate())));

        var trEdit = this.editingRowJqEle;
        for (var i = 2; i < trEdit.children().length; i++) {
            trEdit.children().get(i).innerHTML = 0;
            trEdit.children().get(i).title = "";
        }

        // by default, it is 5 normal common cards
        this.editingCellCJqEle.text(5);
        this.editingCellDustJqEle.text(25);
    },
    refreshPacksTable: function() {
        this.packsTableJqEle.empty();

        var rows = this.packsData.rows, row,
            tbl = $("<table/>"), tr, td;
        for (var i = rows.length-1; i >= 0; i--) {
            row = rows[i];
            tr = $("<tr/>").appendTo(tbl);
            // row id
            $("<td/>", {
                html: row.id,
                "class": "othertd",
            }).appendTo(tr);
            // date
            $("<td/>", {
                html: row.day,
                "class": "datetd",
            }).appendTo(tr);

            // show the normal first, then the golden
            var offset = CardsInfo.qualityList.length;
            for (var j = 0; j < row.counts.length; j++) {
                td = $("<td/>", {
                    html: (j < offset) ? row.counts[j+offset] : row.counts[j-offset],
                    "class": "othertd"
                }).appendTo(tr);
                if (td.html() != 0) {
                    td.css("backgroundColor", "rgba(0,0,0,0.1)");

                    var title = (j < offset) ? row.tips[j+offset] : row.tips[j-offset];
                    td.attr("title", title ? title : "?");
                }
            }

            // dust
            $("<td/>", {
                html: row.dust,
                "class": "othertd"
            }).appendTo(tr);
        }
        this.packsTableJqEle.append(tbl);

        this.refreshPacksEditRow();
    },
    refreshCharts: function() {
        this.refreshTrendChart();
        this.refreshCountsChart();
        this.refreshRatesChart();
        this.refreshPacksTable();
    },
}
/* class PacksPage end */