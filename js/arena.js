/*
	@param: 
		rows: [rowObject], list of database rows
	@member:
		rows: [object], simple form of rs
		gameByClass: [int], list of played games grouped by classes
		gameByWins: [int], list of different wins games
		winsByClass: [int], list of total wins grouped by classes
		winsList: [int], list of wins
		totalWins: int, total wins
*/
function ArenaData(rows) {
	var i = 0, n = rows.length;

	this.rows = [];
	this.gameByClass = new SameArray(GameConst.CLASS_LIST.length, 0);
	this.gameByWins = new SameArray(GameConst.MAX_ARENA_WINS + 1, 0);
	this.winsList = [];
	this.winsByClass = new SameArray(GameConst.CLASS_LIST.length, 0);
	this.totalWins = 0;

	for (; i < n; i++) {
		this.insertRow(rows.item(i));
	}
}

ArenaData.prototype = {
	insertRow: function(row) {
		icls = GameConst.CLASS_LIST.indexOf(row.class);
		w = row.wins;

		this.rows.push(row);
		this.gameByClass[icls]++;
		this.gameByWins[w]++;
		this.winsList.push(w); // TODO: find the position instead of appending
		this.winsByClass[icls] += w;
		this.totalWins += w;
	},
	deleteById: function(id) {
		var i = id, // TODO: find the position instead of simple mapping
			r = this.rows[i],
			icls = GameConst.CLASS_LIST.indexOf(r.class),
			w = r.wins;

		this.rows.splice(i);
		this.gameByClass[icls]--;
		this.gameByWins[w]--;
		this.winsList.splice(i);
		this.winsByClass[icls] -= w;
		this.totalWins -= w;
	}
}

/* class ArenaPage begin */
function ArenaPage(container) {
	PageBase.apply(this, arguments);
}

ArenaPage.prototype = {
	constructor: ArenaPage,
	_initData: function() {
		var self = this;

		window.dbConn.loadArenaData(function(tx, rs) {
			self.data = new ArenaData(rs.rows);
			self.refreshCharts();
		});
	},
	_initView: function() {
		var select = $(".arena-right select"),
			option;

		// generate the class select
		GameConst.CLASS_LIST.map(function(name) {
			option = $("<option></option>").appendTo(select);
			option.val(name);
			option.text(name);
		});
	},
	_initEventHandler: function() {
		var self = this,
			addButton = $(".arena-add"), delButton = $(".arena-del"),
			idInput = $(".arena-edit-id"), dayInput = $(".arena-edit-day"), classSelect = $(".arena-edit-class"), winsInput = $(".arena-edit-wins"),
			id, row;

		// add the editing one
		addButton.click(function() {
			row = {
				id: idInput.val(),
				day: dayInput.val(),
				class: classSelect.val(),
				wins: parseInt(winsInput.val())
			}

			window.dbConn.insertArenaRow(row, function(tx, rs) {
				self.data.insertRow(row);
				self.refreshCharts();
			});
		});

		// delete the last one
		delButton.click(function() {
			id = self.data.winsList.length - 1;

			window.dbConn.deleteArenaById(id, function(tx, rs) {
				self.data.deleteById(id);
				self.refreshCharts();
			});
		});

		// auto clear the wins field when focused
		winsInput.focus(function() {
			winsInput.val("");
		});

		// TODO: double click, CTRL/SHIFT multi select to delete rows
	},

	_getPieData: function(nameList, dataList) {
		var pieData = [];

		nameList.map(function(name, i) {
			pieData.push({name: nameList[i], data: dataList[i]});
		})

		pieData.sort(function(a, b) {
			return b.data - a.data;
		});

		return pieData;
	},

	refreshTrendChart: function() {
		var trendChart = $(".arena-trend"), circles,
			arenaData = this.data,
			totalGame = arenaData.winsList.length,
			totalAvg = (totalGame == 0) ? 0 : (arenaData.totalWins/totalGame).toFixed(2),
			totalMsg = "totalGame = " + totalGame + "\ntotalWins = " + arenaData.totalWins + "\ntotalAvg = " + totalAvg,
			lineData = [{name: totalMsg, data: arenaData.winsList}],
			lineOptions = {
				axis: {
					x: {
						tickWidth: 20,
						ticks: [],
					},
					y: {
						min: 0,
						max: 11, // if not set, empty input will cause the chart library to crash
						total: 11,
						tickSize: 2,
						tickWidth: 20,
						rotate: 90
					}
				},
				line: {
					dots: true,
					dotRadius: 6
				},
				icons: {
					0: "circle"
				},
				legend: {
					position: ["right", "center"],
					borderColor: "white"
				},
				threshold: {
					y: {
						value: totalAvg
					}
				}
			}, ticks;

		ticks = Object.keys(arenaData.winsList);
		ticks.push(arenaData.winsList.length);
		ticks.shift();
		lineOptions.axis.x.ticks = ticks;

		if (this.trendChartObj) this.trendChartObj.destroy();
		this.trendChartObj = new Venus.SvgChart(trendChart.get(0), lineData, lineOptions);

		// highlight 12 wins
		circles = trendChart.find("circle");
		circles.map(function(i, ele) {
			// FIXME: hardcard the cy filter
			if (ele.getAttribute("cy") != "20") return;
			ele.highlight && ele.highlight();
		});
	},
	refreshWinsChart: function() {
		var winsChart = $(".arena-wins"),
			arenaData = this.data,
			winsData = [{name: 0, data: {}}],
			winsOptions = {
				axis: {
					x: {
						total: 9,
						tickWidth: 60,
						ticks: GameConst.CLASS_LIST,
						labelRotate: 33
					},
					y: {
						min: 0,
						max: 11,
						total: 11,
						tickSize: 2,
						tickWidth: 16,
						rotate: 90
					}
				},
				bar: {
					radius: 0
				}
			};

		GameConst.CLASS_LIST.map(function(name, i) {
			winsData[0].data[name] = (arenaData.gameByClass[i] == 0) ? 0: (arenaData.winsByClass[i]/arenaData.gameByClass[i]).toFixed(2);
		});

		if (this.winsChartObj) this.winsChartObj.destroy();
		this.winsChartObj = new Venus.SvgChart(winsChart.get(0), winsData, winsOptions);
	},
	refreshRatesChart: function() {
		var classPie = $(".arena-class-pie"), winsPie = $(".arena-wins-pie"),
			arenaData = this.data,
			classPieData = this._getPieData(GameConst.CLASS_LIST, arenaData.gameByClass),
			winsPieData = this._getPieData(Object.keys(arenaData.gameByWins), arenaData.gameByWins),
			pieOptions = {
				pie: {
					radius: 60, 
					rotate: 45
				}
			};

		if (arenaData.winsList.length == 0) return;

		if (this.classPieObj) this.classPieObj.destroy();
		this.classPieObj = new Venus.SvgChart(classPie.get(0), classPieData, pieOptions);

		if (this.winsPieObj) this.winsPieObj.destroy();
		this.winsPieObj = new Venus.SvgChart(winsPie.get(0), winsPieData, pieOptions);
	},
	refreshEditRow: function() {
		var idInput = $(".arena-edit-id"), dayInput = $(".arena-edit-day"), classSelect = $(".arena-edit-class"), winsInput = $(".arena-edit-wins"),
			today = new Date(),
			y = today.getFullYear(), m = today.getMonth() + 1, d = today.getDate();

		if (m < 10) m = "0" + m;
		if (d < 10) d = "0" + d;

		idInput.val(this.data.winsList.length + 1);
		dayInput.val([y, m, d].join("-"));
		classSelect.val(0);
		winsInput.val(0);
	},
	refreshArenaTable: function() {
		var rows = this.data.rows, row,
			table = $(".arena-table"), tr, td;

		table.html("");
		for (var i = rows.length-1; i >= 0; i--) {
			row = rows[i];

			tr = $("<tr></tr>").appendTo(table);
			Object.keys(row).map(function(key) {
				$("<td></td>", {html: row[key]}).appendTo(tr);
			});
		}

		this.refreshEditRow();
	},
	refreshCharts: function() {
		this.refreshTrendChart();
		this.refreshWinsChart();
		this.refreshRatesChart();
		this.refreshArenaTable();
	}
}
$.extend(ArenaPage.prototype, PageBase.prototype);
/* class ArenaPage end */