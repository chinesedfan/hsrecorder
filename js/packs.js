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
        this.page.cardInputJqEle.css("color", this.getSelectedLabelDomEle().style.color);
        this.page.autoInputJqEle.hide();
    },
    updatePosition: function() {
        var ele = this.page.cardInputJqEle;
        this.page.autoInputJqEle.css({
            width: ele.outerWidth() + "px",
            top: ele.outerHeight() + "px",
            left: ele.offset().left + "px",
        });
    },
}
/* class AutoInput begin */

/* class PacksPage begin */
function PacksPage(container) {
    PageBase.apply(this, arguments);
}

PacksPage.prototype = {
    _initView: function() {
        var page = this;
        // this page includes the trend chart and the bottom part
        var trendChartJqEle = $("<div/>").appendTo(this.container);
        trendChartJqEle.attr("id", "packs-trend");
        trendChartJqEle.attr("class", "chart");

        var bottomJqEle = $("<div/>").appendTo(this.container);
        bottomJqEle.attr("class", "bottom");
        bottomJqEle.css("top", (this.container.offsetTop + trendChartJqEle.height()) + "px");

        // the bottom part includes the left part and the right part
        var leftBottomJqEle = $("<div/>").appendTo(bottomJqEle);
        leftBottomJqEle.attr("class", "half");
        leftBottomJqEle.css("height", "100%");

        var rightBottomJqEle = $("<div/>").appendTo(bottomJqEle);
        rightBottomJqEle.attr("class", "half");
        rightBottomJqEle.css("height", "100%");

        // the left bottom part includes two charts
        var countsChartJqEle = $("<div/>").appendTo(leftBottomJqEle);
        countsChartJqEle.attr("id", "quality-parts");
        countsChartJqEle.attr("class", "chart center");

        var ratesChartJqEle = $("<div/>").appendTo(leftBottomJqEle);
        ratesChartJqEle.attr("id", "quality-rates");
        ratesChartJqEle.attr("class", "bottom");
        ratesChartJqEle.css("top", countsChartJqEle.height() + "px");

        // the right bottom part includes 4 parts
        var appendRowJqEle = $("<div/>").appendTo(rightBottomJqEle);
        var buttonAreaJqEle = $("<div/>").appendTo(rightBottomJqEle);
        var fixedTableJqEle = $("<table/>").appendTo(rightBottomJqEle);
        var packsTableJqEle = $("<div/>").appendTo(rightBottomJqEle);
        packsTableJqEle.attr("id", "packs-table");
        packsTableJqEle.attr("class", "bottom");
        packsTableJqEle.css("overflow-y", "auto");

        // the append row includes 4 parts
        var goldenButtonJqEle = $("<button/>").appendTo(appendRowJqEle);
        goldenButtonJqEle.attr("id", "golden-btn");
        goldenButtonJqEle.attr("class", "quarter");
        goldenButtonJqEle.text("Normal");

        var cardInputJqEle = $("<input/>").appendTo(appendRowJqEle);
        cardInputJqEle.attr("id", "card-input");
        cardInputJqEle.attr("class", "half");

        var autoInputJqEle = $("<div/>").appendTo(appendRowJqEle);
        autoInputJqEle.attr("id", "auto-input");
        autoInputJqEle.attr("class", "auto-input");

        var appendButtonJqEle = $("<button/>").appendTo(appendRowJqEle);
        appendButtonJqEle.attr("id", "append-btn");
        appendButtonJqEle.attr("class", "quarter");
        appendButtonJqEle.text("Append");

        // the button area include two buttons
        var addButtonJqEle = $("<button/>").appendTo(buttonAreaJqEle);
        addButtonJqEle.attr("id", "packs-add");
        addButtonJqEle.attr("class", "half");
        addButtonJqEle.text("Add Editing");

        var delButtonJqEle = $("<button/>").appendTo(buttonAreaJqEle);
        delButtonJqEle.attr("id", "packs-del");
        delButtonJqEle.attr("class", "half");
        delButtonJqEle.text("Remove Last");

        // the fixed table includes its head row and the edit row
        var headRowJqEle = $("<tr/>").appendTo(fixedTableJqEle);
        headRowJqEle.attr("id", "packs-thead");
        var texts = ["id", "day"];
        CardsInfo.qualityList.map(function(q) { texts.push(q.name[0]); });
        CardsInfo.qualityList.map(function(q) { texts.push("G-" + q.name[0]); });        
        texts.push("dust");
        texts.map(function(t) {
            var td = $("<td/>").appendTo(headRowJqEle);
            td.attr("class", t == "day" ? "datetd" : "othertd");
            td.text(t);
        });

        var editingRowJqEle = $("<tr/>").appendTo(fixedTableJqEle);
        editingRowJqEle.attr("id", "packs-edit");
        var cellids = ["packs-id", "packs-day"];
        CardsInfo.qualityList.map(function(q) { cellids.push("normal-" + q.color); });
        CardsInfo.qualityList.map(function(q) { cellids.push("golden-" + q.color); });        
        cellids.push("packs-dust");
        cellids.map(function(c) {
            var td = $("<td/>").appendTo(editingRowJqEle);
            td.attr("class", c == "packs-day" ? "datetd" : "othertd");
            // the first two own an inner input box
            if (c == "packs-id" || c == "packs-day") {
                var input = $("<input/>").appendTo(td);
                input.attr("id", c);
            } else {
                td.attr("id", c);
            }
        });

        // set css style at last
        $("button").map(function(i, domEle) { domEle.className += " btn btn-default"; }); 
        $("input").map(function(i, domEle) { domEle.className += " form-control"; });
        packsTableJqEle.css("top", (goldenButtonJqEle.outerHeight() + addButtonJqEle.outerHeight() + fixedTableJqEle.height()) + "px");
    },
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

        this.editIdJqEle = $("#packs-id");
        this.editDayJqEle = $("#packs-day");

        this.packsTableJqEle = $("#packs-table");
        this.editingCellCJqEle = $("#normal-black");
        this.editingCellDustJqEle = $("#packs-dust");

        this.trendChartDomEle = document.getElementById("packs-trend");
        this.countsChartDomEle = document.getElementById("quality-parts");
        this.ratesChartDomEle = document.getElementById("quality-rates");

        this.autoInputObj = new AutoInput(this);

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
        this.goldenButtonJqEle.click(function () {
            // toggle this button between golden and normal
            var btn = page.goldenButtonJqEle;
            if (btn.text() == "Golden") {
                btn.text("Normal");
                btn.css("background-color", "#fff");
            } else {
                btn.text("Golden");
                btn.css("background-color", "#ffff00");
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
                var lbl = $("<label/>").appendTo(page.autoInputJqEle);
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
            page.autoInputObj.updatePosition();

            page.autoInputJqEle.show();
        });
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
    },
    refreshCountsChart: function() {
        this.countsChartDomEle.innerHTML = "";

        var tbl, tr, td;
        tbl = $("<table/>").appendTo(this.countsChartDomEle);
        tbl.attr("class", "table table-boarded");

        tr = $("<tr><td/><td>Normal</td><td>Golden</td></tr>").appendTo(tbl);
        for (var i = 0; i < CardsInfo.qualityList.length; i++) {
            tr = $("<tr/>").appendTo(tbl);

            td = $("<td/>").appendTo(tr);
            td.text(CardsInfo.qualityList[i].name);
            td = $("<td/>").appendTo(tr);
            td.text(this.packsData.sums[i+CardsInfo.qualityList.length]);
            td = $("<td/>").appendTo(tr);
            td.text(this.packsData.sums[i]);
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

        var rows = this.packsData.rows;
        var tbl = document.createElement("table");
        for (var i = rows.length-1; i >= 0; i--) {
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

            // show the normal first, then the golden
            var offset = CardsInfo.qualityList.length;
            for (var j = 0; j < row.counts.length; j++) {
                td = document.createElement("td");
                td.innerHTML = (j < offset) ? row.counts[j+offset] : row.counts[j-offset];
                if (td.innerHTML != 0) {
                    td.style.backgroundColor = "rgba(0,0,0,0.1)";

                    td.title = (j < offset) ? row.tips[j+offset] : row.tips[j-offset];
                    if (!td.title) td.title = "?";
                }
                td.className = "othertd";
                tr.appendChild(td);
            }

            td = document.createElement("td");
            td.innerHTML = row.dust;
            td.className = "othertd";
            tr.appendChild(td);

            tbl.appendChild(tr);
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