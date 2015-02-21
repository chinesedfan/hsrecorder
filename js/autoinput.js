function AutoInput(cardInput) {
    var container = cardInput.parent(),
        suggestDiv = $("<div></div>").appendTo(container),
        LABEL_INDEX = "label-index", QUALITY_INDEX = "quality-index", CARD_ID = "card-id";

    // set relative position
    container.css("position", "relative");
    suggestDiv.addClass("suggest-div");

    // the selected index and element
    selectedIndex = 0;
    selectedLabel = undefined;

    // clear the content when obtaining focus
    cardInput.focus(function () {
        cardInput.val("");
    });
    // hide the candidates area when losing focus, but not clear
    // delay a while for the click event to be triggered
    cardInput.blur(function () {
        window.setTimeout(function() { suggestDiv.hide(); }, 100);
    });
    // keyboard events handler
    cardInput.keyup(function (event) {
        // special keys
        switch(event.which) {
            case 13: // enter
                confirmSelectedLabel();                
                return;
            case 27: // escape
                suggestDiv.hide();
                return;
            case 38: // arrow up
                updateCursor(true);
                return;
            case 40: // arrow down
                updateCursor(false);
                return;
        }

        // normal input, use the perfix as key to find card candidates
        var key = cardInput.val(), list;

        if (key.length >= 10) key = key.substring(0, 10);
        list = CardsInfo.prefixMap[key];
        if (!list) return;
        if (list.length >= 10) list.splice(10, list.length-10);

        suggestDiv.empty();
        list.map(function(card) {
            // normal card infomation label
            var item = $("<label/>").appendTo(suggestDiv);
            item.attr(LABEL_INDEX, suggestDiv.children("label").length - 1);
            item.attr(CARD_ID, card.id);
            item.attr(QUALITY_INDEX, 5 - parseInt(card.id/10000));
            item.css("color", CardsInfo.qualityList[item.attr(QUALITY_INDEX)].color);
            item.text(card.name);
            item.mouseover(function() {
                setSelectedIndex(item.attr(LABEL_INDEX));
            });
            item.click(function() {
                confirmSelectedLabel();
            });
            // additional line break element
            $("<br/>").appendTo(suggestDiv);
        });

        setSelectedIndex(0);

        suggestDiv.css({
            position: "absolute",
            width: cardInput.outerWidth() + "px",
            top: cardInput.position().top + cardInput.outerHeight() + "px",
            left: cardInput.position().left + "px",
        });
        suggestDiv.show();
    });

    function setSelectedIndex(index) {
        var labels = suggestDiv.children("label");

        selectedIndex = index;

        if (selectedLabel) {
            selectedLabel.removeClass("card-selected");
        }
        selectedLabel = $(labels[selectedIndex])
        selectedLabel.addClass("card-selected");
    }

    function updateCursor(isUp) {
        var labels = suggestDiv.children("label");

        if (!isUp) {
            selectedIndex++;
            if (selectedIndex > labels.length) selectedIndex = 0;
        } else {
            selectedIndex--;
            if (selectedIndex < 0) selectedIndex = labels.length - 1;
        }

        setSelectedIndex(selectedIndex);
    }

    function confirmSelectedLabel() {
        if (!selectedLabel) return;

        cardInput.val(selectedLabel.text());
        cardInput.css("color", selectedLabel.get(0).style.color); // $.css will just returns rgb
        cardInput.attr(CARD_ID, selectedLabel.attr(CARD_ID));
        cardInput.attr(QUALITY_INDEX, selectedLabel.attr(QUALITY_INDEX));

        suggestDiv.hide();
    }
}