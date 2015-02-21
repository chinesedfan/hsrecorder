/*
   Database location:
	   Windows Vista or 7: \Users\_username_\AppData\Local\Google\Chrome\User Data\Default\databases
	   Windows XP: \Documents and Settings\_username_\Local Settings\Application Data\Google\Chrome\User Data\Default\databases
	   Mac OS X: ~/Library/Application\ Support/Google/Chrome/Default/databases
	   Linux: ~/.config/google-chrome/Default/databases
*/
function DbConn(opts) {
	var arena = opts ? opts.arena || "arena" : "arena",
		packs = opts ? opts.packs || "packs" : "packs",
		lacks = opts ? opts.lacks || "lacks" : "lacks";

	this._db = openDatabase("hsdb", "1.0", "HearthStone Records", "4096");
	
	// prepare sqls
	this.sqlCreateArena = "CREATE TABLE IF NOT EXISTS " + arena + "(id integer PRIMARY KEY UNIQUE,day date,class varchar,wins integer)";
	this.sqlCreatePacks = "CREATE TABLE IF NOT EXISTS " + packs + "(id integer PRIMARY KEY UNIQUE,day date,count_gl integer,count_ge integer,count_gr integer,count_gc integer,count_l integer,count_e integer,count_r integer,count_c integer,tip_gl text,tip_ge text,tip_gr text,tip_gc text,tip_l text,tip_e text,tip_r text,tip_c text,dust integer)";
	this.sqlCreateLacks = "CREATE TABLE IF NOT EXISTS " + lacks + "(id integer PRIMARY KEY AUTOINCREMENT UNIQUE,card_id integer,card_name text,card_quality integer)";

	this.sqlLoadArenaData = "SELECT * FROM " + arena;
	this.sqlInsertArenaRow = "INSERT INTO " + arena + "(id, day, class, wins) VALUES(?, ?, ?, ?)";
	this.sqlDeleteArenaById = "DELETE FROM " + arena + " WHERE id = ?";

	this.sqlLoadPacksData = "SELECT * FROM " + packs + "";
	this.sqlInsertPacksRow = "INSERT INTO " + packs + " VALUES(?,?, ?,?,?,?,?,?,?,?, ?,?,?,?,?,?,?,?, ?)";
	this.sqlDeletePacksById = "DELETE FROM " + packs + " WHERE id = ?";

	this.sqlLoadLacksData = "SELECT * FROM " + lacks + "";
	this.sqlInsertLacksRow = "INSERT INTO " + lacks + "(card_id, card_name, card_quality) VALUES(?,?,?)";
	this.sqlDeleteLacksById = "DELETE FROM " + lacks + " WHERE id IN (SELECT min(id) FROM lacks WHERE card_id = ?)";

	// init the database
	this.execSqls([this.sqlCreateArena, this.sqlCreatePacks, this.sqlCreateLacks]);
}

DbConn.prototype = {
	constructor: DbConn,

	_onSqlError: function(tx, error) {
		alert("[onSqlError]" + error.message);
	},

	execSql: function(sql, args, onSucc, onErr) {
		var self = this;
		
		self._db.transaction(function(tx) {
			tx.executeSql(sql, args || [], onSucc, onErr || self._onSqlError);
		});
	},
	execSqls: function(sqls) {
		var self = this,
			i, n = sqls.length, success = 0;
		
		self._db.transaction(function(tx) {
			for (i = 0; i < n; i++) {
				tx.executeSql(sqls[i], [], function(tx, rs) {
					console.log("[execSqlScript]" + (++success) + "/" + n);
				}, self._onSqlError);
			}
		});
	},
	execSqlScript: function(script) {
		var sqls = script.split(';\n');

		this.execSqls(sqls);
	},

	loadArenaData: function(callback) {
		this.execSql(this.sqlLoadArenaData, [], callback);
	},
	insertArenaRow: function(row, callback) {
		this.execSql(this.sqlInsertArenaRow, [row.id, row.day, row.class, row.wins], callback);
	},
	deleteArenaById: function(id, callback) {
		this.execSql(this.sqlDeleteArenaById, [id], callback);
	},

	loadPacksData: function(callback) {
		this.execSql(this.sqlLoadPacksData, [], callback);
	},
	insertPacksRow: function(rowData, callback) {
		var args = [rowData.id, rowData.day];

		args = args.concat(rowData.counts).concat(rowData.tips);
		args.push(rowData.dust);

		this.execSql(this.sqlInsertPacksRow, args, callback);
	},
	deletePacksById: function(id, callback) {
		this.execSql(this.sqlDeletePacksById, [id], callback);
	},

	loadLacksData: function(callback) {
		this.execSql(this.sqlLoadLacksData, [], callback);
	},
	insertLacksRow: function(row, callback) {
		this.execSql(this.sqlInsertLacksRow, [row.id, row.name, row.quality], callback);
	},
	deleteLacksById: function(id, callback) {
		this.execSql(this.sqlDeleteLacksById, [id], callback);
	}
}