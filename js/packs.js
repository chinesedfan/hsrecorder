function PacksPage() {
    PageBase.apply(this);
}

PacksPage.prototype = {
    _initMember: function() {
        this._dbConn = new DbConn();
        this._autoCursor = 0;
        this._autoLabels = [];
        this._editingCids = [];

        this.tableHeaderJqEle = $("#packs-thead");
        this.editingRowJqEle = $("#packs-edit");

        this.goldenButtonJqEle = $("#golden-btn");
        this.addButtonJqEle = $("#packs-add");
        this.delButtonJqEle = $("#packs-del");
        this.appendButtonJqEle = $("#append-btn");

        this.cardInputJqEle = $("#card-input");

        /*
            The following fields may be set by member functions
                this.packsData
        */
    },
    _initData: function() {
        this._dbConn.loadPacksData(this);
    },
    _initView: function() {
        this.refreshPacksTable();
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
                td.text(0);
            });

            td = $("<td/>").appendTo($("#packs-edit"));
            td.attr("id", "packs-dust");
            td.attr("class", "othertd");
            td.text(0);
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
            row.id = $("#packs-id").val();
            row.day = $("#packs-day").val();
            row.counts = [];
            row.tips = [];
            for (var i = 2; i < 10; i++) {
                row.counts.push(tr.children().get(i).innerHTML);
            };
            for (var i = 2; i < 10; i++) {
                row.tips.push(tr.children().get(i).title);
            };
            row.dust = tr.children().get(10).innerHTML;

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
            page._editingCids.push(label.cid);
            // update numbers in the editing row
            var prefix = "normal";
            if ($("#golden-btn").text() == "Golden") prefix = "golden";
            var cell = $("#" + prefix + "-" + label.style.color);
            var count = parseInt(cell.text());
            if (count == 5) return;
            cell.text(count+1);
            var tip = cell.attr("title");
            cell.attr("title", tip ? tip + "\n" + label.innerHTML : label.innerHTML);
            // update the dust
            cell = $("#packs-dust");
            count = parseInt(cell.text());
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
        setAutoCursor(
            (this._autoCursor == 0) ? (this._autoLabels.length-1) : (this._autoCursor-1));
    },
    _moveDownCursor: function() {
        setAutoCursor(
            (this._autoCursor == this._autoLabels.length-1) ? 0 : (this._autoCursor+1));
    },
    _getSelectedAutoText: function() {
        return this._autoLabels[this._autoCursor].innerHTML;
    },
    _setAutoCursor: function(val) {
        this._autoLabels[this._autoCursor].className = "";
        this._autoCursor = parseInt(val);
        this._autoLabels[this._autoCursor].className = "selected";
    },
    _confirmAutoSelected: function() {
        $("#card-input").attr("value", this._getSelectedAutoText());
        $("#auto-input").hide();
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
            trEdit.children().get(i).innerHTML = 0;
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
            tr.appendChild(td);

            td = document.createElement("td");
            td.innerHTML = row.day;
            tr.appendChild(td);

            for (var j = 0; j < row.counts.length; j++) {
                td = document.createElement("td");
                td.innerHTML = row.counts[j];
                td.title = row.tips[j];
                tr.appendChild(td);
            }

            td = document.createElement("td");
            td.innerHTML = row.dust;
            tr.appendChild(td);

            tbl.appendChild(tr);
        }
        document.getElementById("packs-table").appendChild(tbl);

        this.refreshPacksEditRow();
    },
}