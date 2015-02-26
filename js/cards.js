var Key2Card = (function() {
	var prefixMap = {},
		name, key, list;

	// only classify by prefixes that are shorter than three
	CardList.forEach(function(card, i) {
		name = card.CARDNAME.toLowerCase();
		for (var i = 0; i < 3; i++) {
			key = name.substring(0, i + 1);

			if (!(key in prefixMap)) prefixMap[key] = [];
			prefixMap[key].push(card);
		}
	});

	// sort indexed cards
	for (key in prefixMap) {
		list = prefixMap[key];
		
		if (list.length >= GameConst.SUGGEST_ITEM_MAX) {
			list.splice(GameConst.SUGGEST_ITEM_MAX, list.length - GameConst.SUGGEST_ITEM_MAX);
		}

		list.sort(function(o1, o2) {
			return o1.CARDNAME.localeCompare(o2.CARDNAME);
		});
	};

	return prefixMap;
})();