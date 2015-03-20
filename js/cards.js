var Key2Card = (function() {
	var prefixMap = {},
		name, key, list;

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

	return prefixMap;
})();