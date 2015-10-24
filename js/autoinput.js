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
		window.setTimeout(function() { suggestDiv.hide(); }, 200);
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

		suggestDiv.hide();
		suggestDiv.empty();

		if (key.length >= GameConst.SUGGEST_KEY_MAX_LEN) key = key.substring(0, GameConst.SUGGEST_KEY_MAX_LEN);
		list = Key2Card.getCards(key);
		if (!list) return;

		list.map(function(card) {
			// normal card infomation label
			var item = $("<label/>").appendTo(suggestDiv),
				qindex = parseInt(GameConst.RARITY_MAX - card.RARITY);

			if (qindex == 4) qindex = 3; // skipped RARITY=2, which means free cards

			item.attr(LABEL_INDEX, suggestDiv.children("label").length - 1);
			item.attr(CARD_ID, card.CardID);
			item.attr(QUALITY_INDEX, qindex);
			item.css("color", QualityList[qindex].color);
			item.text(card.CARDNAME);
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