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

		node.card = card;
	});

	function _getCards(key) {
		var queue = [root], result = [];

		root.position = 0;
		// travel the tree level by level
		while(queue.length) {
			node = queue.shift();

			for (letter in node.children) {
				node.children[letter].position = node.position;
				queue.push(node.children[letter]);
			}

			if (node.position < key.length) {
				letter = key[node.position];
				if (node.children[letter]) {
					node.children[letter].position = node.position + 1;
				}
			} else if (node.card) {
				result.push(node.card);
			}
		}

		return result;
	}

	return {
		getCards: _getCards
	};
})();