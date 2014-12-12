(function () {
	var Fs = require('fs');

	function printHelp() {
		console.log('Usage: node parseCs.js <csharp_file> <output_file>');
	}

	// The first is 'node', and the second is this file's full path.
	var args = process.argv.splice(2);
	if (args.length != 2) {
		printHelp();
		return;
	}

	var content = Fs.readFileSync(args[0], 'utf-8'),
	    lines = content.split('\n'),
	    line, key, value, index;
	console.log('var TagMap={');
	for (var i = 0; i < lines.length; i++) {
		line = lines[i];
		if (line.length < 2 || line[0] != '\t' || line[line.length - 1] != ',') continue;

		index = line.indexOf(' = ');
		if (index < 0) continue;
		key = line.substring(1, index);
		value = line.substring(index + 3, line.length - 1);
		console.log('\t\'' + value + '\': \'' + key + '\',');
	}
	console.log('};');
})();