function PacksPage() {
    PageBase.apply(this);
}

PacksPage.prototype = {
    _initMember: function() {
        this._dbConn = new DbConn();
        this._autoCursor = 0;
        this._autoLabels = [];

        this.tableHeaderJqEle = $("#packs-thead");
        this.editingRowJqEle = $("#packs-edit");
        
        this.goldenButtonJqEle = $("#golden-btn");
        this.addButtonJqEle = $("#packs-add");
        this.delButtonJqEle = $("#packs-del");
        this.appendButtonJqEle = $("#append-btn");

        this.cardInputJqEle = $("#card-input");

        this.trendChartDomEle = document.getElementById("packs-trend");
        this.countsChartDomEle = document.getElementById("quality-parts");
        this.ratesChartDomEle = document.getElementById("quality-rates");

        /*
            The following fields may be set by member functions
                this.packsData
                this.trendObj, this.numsObj, this.ratesObj
                this.editingCellCJqEle
        */
    },
    _initData: function() {
        this._dbConn.loadPacksData(this);
    },
    _initView: function() {
        // do nothing
    },
    _initEventHandler: function() {
        var page = this;
        this.tableHeaderJqEle.ready(function () {
            var texts = ["id", "day"];
            CardsInfo.qualityList.map(function(q) { texts.push("G-" + q.name[0]); });
            CardsInfo.qualityList.map(function(q) { texts.push(q.name[0]); });
            texts.push("dust");

            texts.map(function(t) {
                var td = $("<td/>").appendTo($("#packs-thead"));
                td.attr("class", t == "day" ? "datetd" : "othertd");
                td.text(t);
            });
        });
        this.editingRowJqEle.ready(function () {
            // prepare the edit row
            var td, input;
            td = $("<td/>").appendTo($("#packs-edit"));
            td.attr("class", "othertd");
            input = $("<input/>").appendTo(td);
            input.attr("id", "packs-id");

            td = $("<td/>").appendTo($("#packs-edit"));
            input = $("<input/>").appendTo(td);
            input.attr("id", "packs-day");
            td.attr("class", "datetd");

            CardsInfo.qualityList.map(function(q) {
                td = $("<td/>").appendTo($("#packs-edit"));
                td.attr("id", "golden-"+q.color);
                td.attr("class", "othertd");
                td.text(0);
            });
            CardsInfo.qualityList.map(function(q) {
                td = $("<td/>").appendTo($("#packs-edit"));
                td.attr("id", "normal-"+q.color);
                td.attr("class", "othertd");
                td.text(q.color == CardsInfo.qualityList[3].color ? 5 : 0);
            });

            page.editingCellCJqEle = $("#normal-black");

            td = $("<td/>").appendTo($("#packs-edit"));
            td.attr("id", "packs-dust");
            td.attr("class", "othertd");
            td.text(5*CardsInfo.qualityList[3].dust);
        });

        this.goldenButtonJqEle.click(function () {
            // toggle this button between golden and normal
            var btn = $("#golden-btn");
            if (btn.text() == "Golden") {
                btn.text("Normal");
            } else {
                btn.text("Golden");
            }
        });
        this.addButtonJqEle.click(function() {
            var tr = $("#packs-edit");
            var row = {};
            // FIXME: ugly codes blow
            row.id = parseInt($("#packs-id").val());
            row.day = $("#packs-day").val();
            row.counts = [];
            row.tips = [];
            for (var i = 2; i < 10; i++) {
                row.counts.push(parseInt(tr.children().get(i).innerHTML));
            };
            for (var i = 2; i < 10; i++) {
                row.tips.push(tr.children().get(i).title);
            };
            row.dust = parseInt(tr.children().get(10).innerHTML);

            page._dbConn.insertPacksData(page, row);
        });
        this.delButtonJqEle.click(function() {
            var row = {};
            row.id = page.packsData.rows.length;
            page._dbConn.deletePacksData(page, row);
        });
        this.appendButtonJqEle.click(function () {
            var label = page._autoLabels[page._autoCursor]; 
            if (label.innerHTML != $("#card-input").val()) return;
            // update numbers in the editing row
            var prefix = "normal";
            if ($("#golden-btn").text() == "Golden") prefix = "golden";
            var cell = $("#" + prefix + "-" + label.style.color);
            var count = parseInt(cell.text());
            if (count == 5) return;
            cell.text(count+1);
            var tip = cell.attr("title");
            cell.attr("title", tip ? tip + "\n" + label.innerHTML : label.innerHTML);
            // update the normal common cell
            page.editingCellCJqEle.text(parseInt(page.editingCellCJqEle.text()) - 1);
            // update the dust
            cell = $("#packs-dust");
            count = parseInt(cell.text()) - 5; // to replace a normal common
            var index = label.getAttribute("cardqindex");
            if (prefix == "golden") {
                cell.text(count + CardsInfo.qualityList[index].gdust);
            } else {
                cell.text(count + CardsInfo.qualityList[index].dust);
            }
        });

        this.cardInputJqEle.keyup(function (event) {
            var key = event.which; 
            switch(key) {
            case 13: // enter
                page._confirmAutoSelected();
                return;
            case 27: // escape
                $("#auto-input").hide();
                return;
            case 38: // arrow up
                page._moveUpCursor();
                return;
            case 40: // arrow down
                page._moveDownCursor();
                return;
            }

            var autoInput = $("#auto-input");
            autoInput.empty();

            var cardInput = $("#card-input");
            var key = cardInput.val();
            if (key == "") {
                autoInput.hide();
                return; 
            }

            if (key.length >= 10) key = key.substring(0, 10);
            var list = CardsInfo.prefixMap[key];
            if (!list) return;
            if (list.length >= 10) list.splice(10, list.length-10);

            list.map(function(row) {
                var lbl = $("<label></label>").appendTo(autoInput);
                lbl.attr("labelindex", autoInput.children("label").length-1);
                lbl.attr("cardid", row.id);
                lbl.attr("cardqindex", 5 - parseInt(row.id/10000));
                lbl.css("color", CardsInfo.qualityList[lbl.attr("cardqindex")].color);
                lbl.text(row.name);
                lbl.mouseover(function() {
                    page._setAutoCursor(lbl.attr("labelindex"));
                });
                lbl.click(function() {
                    $("#card-input").attr("value", page._getSelectedAutoText());
                    $("#auto-input").hide();
                });
                $("<br/>").appendTo(autoInput);
            });
            autoInput.show();

            page._autoLabels = autoInput.children("label");
            page._setAutoCursor(0);
        });
    },

    _moveUpCursor: function() {
        this._setAutoCursor(
            (this._autoCursor == 0) ? (this._autoLabels.length-1) : (this._autoCursor-1));
    },
    _moveDownCursor: function() {
        this._setAutoCursor(
            (this._autoCursor == this._autoLabels.length-1) ? 0 : (this._autoCursor+1));
    },
    _getSelectedAutoText: function() {
        return this._autoLabels[this._autoCursor].innerHTML;
    },
    _setAutoCursor: function(val) {
        if (this._autoCursor < this._autoLabels.length) {
            this._autoLabels[this._autoCursor].className = "";
        }
        this._autoCursor = parseInt(val);
        this._autoLabels[this._autoCursor].className = "selected";
    },
    _confirmAutoSelected: function() {
        $("#card-input").attr("value", this._getSelectedAutoText());
        $("#auto-input").hide();
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