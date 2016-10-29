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
        return data[key] || {};
    }

    return {
        getCard: _getCard
    };
})();

var CardDetails = function() {
    var config = CardCounts;
    var current = $.extend({}, config, true);

    function _update(cardId, delta) {
        // TODO:
    }

    return {
        config: config,
        current: current,
        addLack: function(cardId) {
            _update(cardId, 1);
        },
        delLack: function(cardId) {
            _update(cardId, -1);
        }
    };
};
