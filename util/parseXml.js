(function () {
	var Fs = require('fs');
	// run 'npm install <module> -g' if need
	var DOMParser = require('xmldom').DOMParser;

	function printHelp() {
		console.log('Usage: node parseXml.js <xml_file> <tag_map_file> [-a]');
		console.log('Options:');
		console.log('    -a: output full card infomation, default is simplified.');
	}

	// The first is 'node', and the second is this file's full path.
	var args = process.argv.splice(2),
		shouldSimplify = true;

	if (args.length != 2 && args.length != 3) {
		printHelp();
		return;
	}

	if (args.length == 3 && args[2] == '-a') {
		shouldSimplify = false;
	}

	var TagMap = require(args[1]);
	function node2obj(entity) {
		var obj = {}, key,
		    tags = entity.getElementsByTagName('Tag'),
		    tid, type, value, text;

		obj['CardID'] = entity.getAttribute('CardID');
		for (var i = 0; i < tags.length; i++) {
			tid = tags[i].getAttribute('enumID');
			type = tags[i].getAttribute('type');
			value = tags[i].getAttribute('value');
			text = tags[i].textContent;

			key = TagMap[tid];	
			if (!key) continue;
			obj[key] = (type == 'String') ? text : parseInt(value);
		}
		return obj;
	}

	var content = Fs.readFileSync(args[0], 'utf-8'),
	    xmlDoc = (new DOMParser()).parseFromString(content, 'text/xml'),
	    entities = xmlDoc.getElementsByTagName('Entity'),
	    objs = [], obj;
	for (var i = 0; i < entities.length; i++) {
		obj = node2obj(entities[i]);

		if (shouldSimplify) obj = simplifyCard(obj);
		if (!obj) continue;

		obj = sortDict(obj);
		objs.push(obj);
	}
	objs.sort(function(o1, o2) {
		return o1.CARDNAME.toLowerCase().localeCompare(o2.CARDNAME.toLowerCase());
	});

	// filter our interested cards and fields
	function simplifyCard(obj) {
		var ret = {},
			NEEDS = ['CARDNAME', 'CardID', 'RARITY'];

		// a valid card should have artist name and flavor text
		if (!obj.ARTISTNAME) return null;
		if (!obj.FLAVORTEXT) return null;

		// exclude those earned at special levels
		if (obj.HOW_TO_EARN && obj.HOW_TO_EARN.indexOf('Unlocked at') == 0) return null;
		if (obj.HOW_TO_EARN_GOLDEN && obj.HOW_TO_EARN_GOLDEN.indexOf('Unlocked at') == 0) return null;

		// no rarity means given by another card
		if (!obj.RARITY) return null;
		// ignore free cards
		if (obj.RARITY == 2) return null;

		// only keep the neccessary fields
		NEEDS.forEach(function(key, i) {
			ret[key] = obj[key];
		});

		return ret;
	}

	function sortDict(dict) {
		var ret = {}, 
	        keys = Object.keys(dict).sort();

	    for (var i = 0, n = keys.length, key; i < n; ++i) {
	        key = keys[i];
	        ret[key] = dict[key];
	    }

	    return ret;
	}

	console.log('var CardList =');
	console.log(objs);
	console.log(';');
})();
