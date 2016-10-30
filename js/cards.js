function TrieNode(letter) {
	this.letter = letter;
	this.children = {};
}

var Key2Card = (function() {
	var root = new TrieNode(''), node,
		name, letter;

	// build a trie tree
	CardList.forEach(function(card, i) {
		name = card.CARDNAME.toLowerCase();
		node = root;

		for (i = 0; i < name.length; i++) {
			letter = name[i];
			if (!node.children[letter]) {
				node.children[letter] = new TrieNode(letter);
			}
			node = node.children[letter];
		}

		// only the leaf node has the card
		node.card = card;
	});

	function _getCardsByRoot(r) {
		var stack = [r], result = [],
			node, letters, i, letter;

		// pre-order travelling
		while (stack.length) {
			node = stack.pop();
			if (node.card) {
				result.push(node.card);
				if (result.length == GameConst.SUGGEST_ITEM_MAX) break;
				continue;
			}

			letters = Object.keys(node.children);
			for (i = letters.length - 1; i >= 0; i--) {
				letter = letters[i];
				stack.push(node.children[letter]);
			}
		}
		return result;
	}

	function _getCards(key) {
		var queue = [root], result = [],
			node, letter;

		root.position = 0;
		// travel the tree level by level
		while(queue.length) {
			node = queue.shift();

			if (node.position == key.length) {
				result = result.concat(_getCardsByRoot(node));
				if (result.length >= GameConst.SUGGEST_ITEM_MAX) break;
				continue;
			}

			for (letter in node.children) {
				node.children[letter].position = (letter == key[node.position]) ? node.position + 1 : node.position;
				queue.push(node.children[letter]);
			}
		}

		return result;
	}

	return {
		getCards: _getCards
	};
})();

var Id2Card = (function() {
    var data = {};
    CardList.forEach(function(card) {
        data[card.CardID] = card;
    });

    function _getCard(key) {
        var item = data[key] || {};
        return {
            series: getSeries(item.CardID),
            cls: getClassName(item.CLASS),
            rarity: getRarity(item.RARITY)
        }
    }

    function getSeries(str) {
        var map = {
            FP1: 'NAXX',
            GVG: 'GVG',
            BRM: 'BRM',
            AT: 'AT',
            LOE: 'LOE',
            LOEA10: 'LOE',
            OG: 'OG',
            KAR: 'KAR'
        };
        var prefix = str.replace(/^([^_]+)_.*$/, '$1');
        return map[prefix] || 'CLASSIC';
    }
    function getClassName(number) {
        var list = ["Druid", "Hunter", "Mage", "Paladin", "Priest", "Rogue", "Shaman", "Warlock", "Warrior"];
        if (number == 12) {
            return 'Neutral';
        } else {
            return list[number - 2];
        }
    }
    function getRarity(number) {
        var map = {
            1: 'Common',
            3: 'Rare',
            4: 'Epic',
            5: 'Legendary'
        };
        return map[number];
    }

    return {
        getCard: _getCard
    };
})();

var CardDetails = function() {
    var config = CardCounts;
    var current = $.extend(true, {}, config);

    function _update(cardId, delta) {
        var TOTAL = 'Total';
        var card = Id2Card.getCard(cardId);
        current[card.series][card.cls][card.rarity] += delta;
        current[card.series][card.cls][TOTAL] += delta;
        current[card.series][TOTAL][card.rarity] += delta;

        current[TOTAL][card.cls][TOTAL] += delta;
        current[TOTAL][TOTAL][card.rarity] += delta;
        current[card.series][TOTAL][TOTAL] += delta;

        current[TOTAL][TOTAL][TOTAL] += delta;
    }

    return {
        config: config,
        current: current,
        addLack: function(cardId) {
            _update(cardId, -1);
        },
        delLack: function(cardId) {
            _update(cardId, 1);
        }
    };
};
