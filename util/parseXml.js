(function () {
	var Fs = require('fs');
	// run 'npm install <module> -g' if need
	var DOMParser = require('xmldom').DOMParser;

	function printHelp() {
		console.log('Usage: node parseXml.js <xml_file> <tag_map_file>');
	}

	// The first is 'node', and the second is this file's full path.
	var args = process.argv.splice(2);
	if (args.length != 2) {
		printHelp();
		return;
	}

	var TagMap = require(args[1]);
	function node2obj(entity) {
		var obj = {}, key,
		    tags = entity.getElementsByTagName('Tag'),
		    tid, type, value, text;
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
		objs.push(obj);
	}	

	console.log('var _infoList =');
	console.log(objs);
	console.log(';');
})();
