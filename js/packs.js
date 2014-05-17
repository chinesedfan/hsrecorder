/* class AutoInput begin */
function AutoInput(page) {
    this.page = page;

    this.labelCursor = 0;
}

AutoInput.prototype = {
    setLabelCursor: function(val) {
        if (this.labelCursor < this.getLabelDomEleList().length) {
            this.getSelectedLabelDomEle().className = "";
        }
        this.labelCursor = parseInt(val);
        this.getSelectedLabelDomEle().className = "selected";
    },

    moveUpCursor: function() {
        this.setLabelCursor(
            (this.labelCursor == 0) ? (this.getLabelDomEleList().length-1) : (this.labelCursor-1)
        );
    },
    moveDownCursor: function() {
        this.setLabelCursor(
            (this.labelCursor == this.getLabelDomEleList().length-1) ? 0 : (this.labelCursor+1)
        );
    },

    getLabelDomEleList: function() {
        return this.page.autoInputJqEle.children("label");
    },
    getSelectedLabelDomEle: function() {
        return this.getLabelDomEleList()[this.labelCursor];
    },
    confirmSelectedLabel: function() {
        this.page.cardInputJqEle.attr("value", this.getSelectedLabelDomEle().innerHTML);
        this.page.autoInputJqEle.hide();
    },
}
/* class AutoInput begin */

/* class PacksPage begin */
function PacksPage() {
    PageBase.apply(this);
}

PacksPage.prototype = {
    _initMember: function() {
        this._dbConn = new DbConn();

        this.tableHeaderJqEle = $("#packs-thead");
        this.editingRowJqEle = $("#packs-edit");
        
        this.goldenButtonJqEle = $("#golden-btn");
        this.cardInputJqEle = $("#card-input");
        this.autoInputJqEle = $("#auto-input");
        this.appendButtonJqEle = $("#append-btn");

        this.addButtonJqEle = $("#packs-add");
        this.delButtonJqEle = $("#packs-del");

        this.trendChartDomEle = document.getElementById("packs-trend");
        this.countsChartDomEle = document.getElementById("quality-parts");
        this.ratesChartDomEle = document.getElementById("quality-rates");

        this.autoInputObj = new AutoInput(this);

        /*
            The following fields may be set by member functions
                this.packsData
                this.trendObj, this.numsObj, this.ratesObj
                this.editingCellCJqEle, this.editingCellDustJqEle
        */
    },
    _initData: function() {
        this._dbConn.loadPacksData(this);
    },
    _initView: function() {
        var page = this;
        // set the fixed header 
        var texts = ["id", "day"];
        CardsInfo.qualityList.map(function(q) { texts.push("G-" + q.name[0]); });
        CardsInfo.qualityList.map(function(q) { texts.push(q.name[0]); });
        texts.push("dust");

        texts.map(function(t) {
            var td = $("<td/>").appendTo(page.tableHeaderJqEle);
            td.attr("class", t == "day" ? "datetd" : "othertd");
            td.text(t);
        });
        // prepare the edit row without any values been set
        var cellids = ["packs-id", "packs-day"];
        CardsInfo.qualityList.map(function(q) { cellids.push("golden-" + q.color); });
        CardsInfo.qualityList.map(function(q) { cellids.push("normal-" + q.color); });
        cellids.push("packs-dust");

        cellids.map(function(c) {
            var td = $("<td/>").appendTo(page.editingRowJqEle);
            td.attr("class", c == "packs-day" ? "datetd" : "othertd");
            // the first two own an inner input box
            if (c == "packs-id" || c == "packs-day") {
                var input = $("<input/>").appendTo(td);
                input.attr("id", c);
            } else {
                td.attr("id", c);
            }
        });
        this.editingCellCJqEle = $("#normal-black");
        this.editingCellDustJqEle = $("#packs-dust");
    },
    _initEventHandler: function() {
        var page = this;
        this.goldenButtonJqEle.click(function () {
            // toggle this button between golden and normal
            var btn = this.goldenButtonJqEle;
            if (btn.text() == "Golden") {
                btn.text("Normal");
            } else {
                btn.text("Golden");
            }
        });
        this.cardInputJqEle.keyup(function (event) {
            var key = event.which; 
            // special keys
            switch(key) {
            case 13: // enter
                page.autoInputObj.confirmSelectedLabel();                
                return;
            case 27: // escape
                page.autoInputJqEle.hide();
                return;
            case 38: // arrow up
                page.autoInputObj.moveUpCursor();
                return;
            case 40: // arrow down
                page.autoInputObj.moveDownCursor();
                return;
            }
            // normal input, use the perfix as key to find card candidates
            page.autoInputJqEle.empty();
            page.autoInputJqEle.hide();

            key = page.cardInputJqEle.val();
            if (key.length >= 10) key = key.substring(0, 10);

            var list = CardsInfo.prefixMap[key];
            if (!list) return;
            if (list.length >= 10) list.splice(10, list.length-10);

            list.map(function(card) {
                // normal card infomation label
                var lbl = $("<label></label>").appendTo(page.autoInputJqEle);
                lbl.attr("labelindex", page.autoInputJqEle.children("label").length - 1);
                lbl.attr("cardid", card.id);
                lbl.attr("cardqindex", 5 - parseInt(card.id/10000));
                lbl.css("color", CardsInfo.qualityList[lbl.attr("cardqindex")].color);
                lbl.text(card.name);
                lbl.mouseover(function() {
                    page.autoInputObj.setLabelCursor(lbl.attr("labelindex"));
                });
                lbl.click(function() {
                    page.autoInputObj.confirmSelectedLabel();
                });
                // additional line break element
                $("<br/>").appendTo(page.autoInputJqEle);
            });
            page.autoInputObj.setLabelCursor(0);

            page.autoInputJqEle.show();
        });
        this.appendButtonJqEle.click(function () {
            // verfiy the input
            var curLabelDomEle = page.autoInputObj.getSelectedLabelDomEle();
            if (curLabelDomEle.innerHTML != page.cardInputJqEle.val()) return;
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
            var index = curLabelDomEle.getAttribute("cardqindex");
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
            for (var j = 0, len = CardsInfo.qualityList.length * 2; j < len; i++, j++) {
                row.counts.push(parseInt(tdDomEleList.get(i).innerHTML));
                row.tips.push(tdDomEleList.get(i).title);
            };
            row.dust = parseInt(tdDomEleList.get(i).innerHTML);

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
                    min: 0,
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
            height: 200,
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
    },
    refreshCountsChart: function() {
        if (this.numsObj) this.numsObj.destroy();

        this.numsObj = this._showQualityCounts(this.countsChartDomEle, this.packsData.sums);
    },
    refreshRatesChart: function() {
        if (this.ratesObj) this.ratesObj.destroy();

        this.ratesObj = this._showQualityRates(this.ratesChartDomEle, this.packsData.sums);
    },
    refreshPacksEditRow: function() {
        var trEdit = $("#packs-edit");
        var tdId = $("#packs-id");
        var tdDay = $("#packs-day");

        tdId.val(this.packsData.rows.length + 1);

        var today = new Date();
        var month = today.getMonth()+1; // the special one
        tdDay.val(today.getFullYear() + "-" 
            + ((month>9) ? month : ("0"+month)) + "-"
            + ((today.getDate()>9) ? today.getDate() : ("0"+today.getDate())));

        for (var i = 2; i < trEdit.children().length; i++) {
            var html = 0;
            if (i == trEdit.children().length-2) html = 5; // the normal common
            if (i == trEdit.children().length-1) html = 25; // the dust
            
            trEdit.children().get(i).innerHTML = html;
            trEdit.children().get(i).title = "";
        }
    },
    refreshPacksTable: function() {
        $("#packs-table").empty();

        var rows = this.packsData.rows;
        var tbl = document.createElement("table");
        for (var i = rows.length-1; i >= 0; i--) {
            //TODO: set id and class of each cell
            var row = rows[i];
            var tr = document.createElement("tr");
            var td;

            td = document.createElement("td");
            td.innerHTML = row.id;
            td.className = "othertd";
            tr.appendChild(td);

            td = document.createElement("td");
            td.innerHTML = row.day;
            td.className = "datetd";
            tr.appendChild(td);

            for (var j = 0; j < row.counts.length; j++) {
                td = document.createElement("td");
                td.innerHTML = row.counts[j];
                td.title = row.tips[j];
                td.className = "othertd";
                tr.appendChild(td);
            }

            td = document.createElement("td");
            td.innerHTML = row.dust;
            td.className = "othertd";
            tr.appendChild(td);

            tbl.appendChild(tr);
        }
        document.getElementById("packs-table").appendChild(tbl);

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