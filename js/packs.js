var qualityInfo = [
    {name: "Legendary", color: "organge"},
    {name: "Epic", color: "purple"},
    {name: "Rare", color: "blue"},
    {name: "Common", color: "white"},
];

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
