var qualityInfo = [
    {name: "Legendary", color: "orange"},
    {name: "Epic", color: "purple"},
    {name: "Rare", color: "blue"},
    {name: "Common", color: "black"},
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
    cancelAutoSelected();
    autoCursor--; 
    if (autoCursor == -1) autoCursor = autoLabels.length - 1;
    markAutoSelected();
}

function moveDownCursor() {
    cancelAutoSelected();
    autoCursor++; 
    if (autoCursor == autoLabels.length) autoCursor = 0;
    markAutoSelected();
}

function getSelectedAutoText() {
    return autoLabels[autoCursor].innerHTML;
}

function cancelAutoSelected() {
    autoLabels[autoCursor].className = "";
}

function markAutoSelected() {
    autoLabels[autoCursor].className = "selected";
}

$("#card-input").keyup(function (event) {
    var key = event.which; 
    switch(key) {
    case 13: // enter
        $("#card-input").attr("value", getSelectedAutoText());
        $("#auto-input").hide();
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
        lbl.css("color", qualityInfo[5 - parseInt(row.id/10000)].color);
        lbl.text(row.name);
        $("<br/>").appendTo(autoInput);
    });
    autoInput.show();

    autoCursor = 0;
    autoLabels = autoInput.children("label");
    markAutoSelected();
});
