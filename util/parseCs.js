(function () {
	var Fs = require('fs');

	function printHelp() {
		console.log('Usage: node parseCs.js <csharp_file>');
	}

	// The first is 'node', and the second is this file's full path.
	var args = process.argv.splice(2);
	if (args.length != 1) {
		printHelp();
		return;
	}

	var content = Fs.readFileSync(args[0], 'utf-8'),
	    lines = content.split('\n'),
	    line, key, value, curVal = 0,
	    dict = {}, size = 0,
	    reg = /^\s*([A-Z_][A-Z0-9_]+)(?:\s*=\s*(\d+))?,?\s*$/, matches;
	for (var i = 0; i < lines.length; i++) {
		line = lines[i];
		if (!reg.test(line)) continue;

		matches = reg.exec(line);
		key = matches[1];
		value = matches[2];
		if (!value) {
			value = curVal;
		}
		curVal = parseInt(value) + 1;
		dict[value] = key;
		size++;
	}

	console.log('var TagMap = {');
	for (var key in dict) {
		console.log('\t\'' + key + '\': \'' + dict[key] + '\'' + (--size != 0 ? ',' : ''));	
	}
	console.log('};');
})();
