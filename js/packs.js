var qualityInfo = [
    {name: "Legendary", color: "orange", dust: 1600, gdust: 3200},
    {name: "Epic", color: "purple", dust: 400, gdust: 1600},
    {name: "Rare", color: "blue", dust: 100, gdust: 400},
    {name: "Common", color: "black", dust: 5, gdust: 50},
];

$("#golden-btn").click(function () {
    // toggle this button between golden and normal
    var btn = $("#golden-btn");
    if (btn.text() == "Golden") {
        btn.text("Normal");
    } else {
        btn.text("Golden");
    }
});

$("#packs-thead").ready(function () {
    var texts = ["id", "day"];
    qualityInfo.map(function(q) { texts.push("G-" + q.name[0]); });
    qualityInfo.map(function(q) { texts.push(q.name[0]); });
    texts.push("dust");

    texts.map(function(t) {
        var td = $("<td/>").appendTo($("#packs-thead"));
        td.attr("class", t == "day" ? "datetd" : "othertd");
        td.text(t);
    });
});

$("#packs-edit").ready(function () {
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

    qualityInfo.map(function(q) {
        td = $("<td/>").appendTo($("#packs-edit"));
        td.attr("id", "golden-"+q.color);
        td.attr("class", "othertd");
        td.text(0);
    });
    qualityInfo.map(function(q) {
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

var autoCursor = 0; // the cursor position of auto input
var autoLabels;

function moveUpCursor() {
    setAutoCursor(
        (autoCursor == 0) ? (autoLabels.length-1) : (autoCursor-1));
}

function moveDownCursor() {
    setAutoCursor(
        (autoCursor == autoLabels.length-1) ? 0 : (autoCursor+1));
}

function getSelectedAutoText() {
    return autoLabels[autoCursor].innerHTML;
}

function setAutoCursor(val) {
    autoLabels[autoCursor].className = "";
    autoCursor = parseInt(val);
    autoLabels[autoCursor].className = "selected";
}

function confirmAutoSelected() {
    $("#card-input").attr("value", getSelectedAutoText());
    $("#auto-input").hide();
}

$("#card-input").keyup(function (event) {
    var key = event.which; 
    switch(key) {
    case 13: // enter
        confirmAutoSelected();
        return;
    case 27: // escape
        $("#auto-input").hide();
        return;
    case 38: // arrow up
        moveUpCursor();
        return;
    case 40: // arrow down
        moveDownCursor();
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
    var list = window.cardsMap[key];
    if (!list) return;
    if (list.length >= 10) list.splice(10, list.length-10);

    list.map(function(row) {
        var lbl = $("<label></label>").appendTo(autoInput);
        lbl.attr("labelindex", autoInput.children("label").length-1);
        lbl.attr("cardid", row.id);
        lbl.attr("cardqindex", 5 - parseInt(row.id/10000));
        lbl.css("color", qualityInfo[lbl.attr("cardqindex")].color);
        lbl.text(row.name);
        lbl.mouseover(function() {
            setAutoCursor(lbl.attr("labelindex"));
        });
        lbl.click(confirmAutoSelected);
        $("<br/>").appendTo(autoInput);
    });
    autoInput.show();

    autoLabels = autoInput.children("label");
    setAutoCursor(0);
});

var editingCids = [];

$("#append-btn").click(function () {
    var label = autoLabels[autoCursor]; 
    if (label.innerHTML != $("#card-input").val()) return;
    editingCids.push(label.cid);
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
        cell.text(count + qualityInfo[index].gdust);
    } else {
        cell.text(count + qualityInfo[index].dust);
    }
});

function refreshPacksEditRow() {
    var trEdit = $("#packs-edit");
    var tdId = $("#packs-id");
    var tdDay = $("#packs-day");

    tdId.val(window.packsData.rows.length + 1);

    var today = new Date();
    var month = today.getMonth()+1; // the special one
    tdDay.val(today.getFullYear() + "-" 
        + ((month>9) ? month : ("0"+month)) + "-"
        + ((today.getDate()>9) ? today.getDate() : ("0"+today.getDate())));

    for (var i = 2; i < trEdit.children().length; i++) {
        trEdit.children().get(i).innerHTML = 0;
    }
}

function refreshPacksTable() {
    $("#packs-table").empty();

    var rows = window.packsData.rows;
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

    refreshPacksEditRow();
}

$("#packs-add").click(function() {
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

    insertPacksData(row);
});

$("#packs-del").click(function() {
    var row = {};
    row.id = window.packsData.rows.length;
    deletePacksData(row);
});