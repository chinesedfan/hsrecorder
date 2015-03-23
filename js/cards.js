var Key2Card = (function() {
	var prefixMap = {},
		name, key, i, j;

	// only classify by prefixes that are shorter than three
	CardList.forEach(function(card, i) {
		name = card.CARDNAME.toLowerCase();
		for (var i = 0; i < 3; i++) {
			key = name.substring(0, i + 1);

			if (!(key in prefixMap)) prefixMap[key] = [];

			if (prefixMap[key].length < GameConst.SUGGEST_ITEM_MAX) {
				prefixMap[key].push(card);
			}
		}
	});

	// if candidates are not enough, consider discontinuous substrings
	for (key in prefixMap) {
		if (prefixMap[key].length == GameConst.SUGGEST_ITEM_MAX) continue;

		appendDiscontinuous(key);	
	}

	function appendDiscontinuous(key) {
		CardList.forEach(function(card) {
			name = card.CARDNAME.toLowerCase(), i = 0, j = 0;
			while (i < key.length && j < name.length) {
				while (name[j] != key[i]) { j++; if (j == name.length) break; };
				if (j == name.length) break;

				i++; j++;
			}
			if (i == key.length && card ) {
				prefixMap[key].push(card);
				if (prefixMap[key].length == GameConst.SUGGEST_ITEM_MAX) return false;
			}
		});
	}

	function _getCards(key) {
		if (!prefixMap[key]) {
			prefixMap[key] = [];
			appendDiscontinuous(key);
		}

		return prefixMap[key];
	}

	return {
		getCards: _getCards
	};
})();