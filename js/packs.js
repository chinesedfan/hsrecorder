/*
	@param:
		rows: [rowObject], list of database rows
	@member:
		rows: [object]
			id: int
			day: string
			counts: [int], length = 2*qualities
			tips: [string], length = 2*qualities
			dust: int
		sums: [int], length = 2*qualities, the count of different kinds of cards
		lasts: [int], length = 2*qualities, the last appearance of different kinds of cards, which starts from 1
		oranges: [int], row id of legendary cards, which starts from 1
*/
function PacksData(rows) {
	var i = 0, n = rows.length,
		qlen2 = QualityList.length * 2,
		row, rowData;

	this.rows = [];
	this.sums = new SameArray(qlen2, 0);
	this.lasts = new SameArray(qlen2, 0);
	this.oranges = [];

	for (; i < n; i++) {
		row = rows.item(i);
		rowData = {
			id: row.id,
			day: row.day,
			counts: [row.count_gl, row.count_ge, row.count_gr, row.count_gc, row.count_l, row.count_e, row.count_r, row.count_c],
			tips: [row.tip_gl, row.tip_ge, row.tip_gr, row.tip_gc, row.tip_l, row.tip_e, row.tip_r, row.tip_c],
			dust: row.dust
		};

		this.insertRow(rowData);
	}
}

PacksData.prototype = {
	insertRow: function(rowData) {
		var self = this;

		rowData.counts.map(function(count, i) {
			self.sums[i] += count;
			if (count > 0) {
				self.lasts[i] = rowData.id;
			}
		});

		if (rowData.counts[0] > 0 || rowData.counts[QualityList.length] > 0) {
			self.oranges.push(rowData.id);
		}

		self.rows.push(rowData);
	},
	deleteById: function(id) {
		var rowData = this.rows.pop(), index, //TODO: support to delete any row instead of the last only
			self = this;

		rowData.counts.map(function(count, i) {
			self.sums[i] -= count;
			if (count > 0) {
				for(index = self.rows.length - 1; index >= 0; index--) {
					if (self.rows[index].counts[i] > 0) break;
				}
				self.lasts[i] = index;
			}
		});

		if (rowData.counts[0] > 0 || rowData.counts[QualityList.length] > 0) {
			self.oranges.pop();
		}
	}
}

/* class PacksPage begin */
function PacksPage(container) {
	PageBase.apply(this, arguments);
}

$.extend(PacksPage.prototype, PageBase.prototype);
$.extend(PacksPage.prototype, {
	constructor: PacksPage,
	_initData: function() {
		var self = this;

		window.dbConn.loadPacksData(function(tx, rs) {
			self.data = new PacksData(rs.rows);
			self.refreshCharts();
		});
	},
	_initView: function() {
		var self = this,
			countTable = $(".packs-counts"), tr,
			packsTitle = $(".packs-title"), packsEdit = $(".packs-edit");

		// the card input
		new AutoInput($(".packs-card-name"));

		// the count table
		QualityList.map(function(q) {
			tr = $("<tr></tr>").appendTo(countTable);
			$("<td></td>", { text: q.name, css: { color: q.color } }).appendTo(tr);
			$("<td></td>", { text: 0 }).appendTo(tr);
			$("<td></td>", { text: "+0", css: { color: "red" } }).appendTo(tr);
			$("<td></td>", { text: 0 }).appendTo(tr);
			$("<td></td>", { text: "+0", css: { color: "red" } }).appendTo(tr);
		});

		// the edit title
		QualityList.map(function(q) {
			$("<td></td>", { text: q.name[0] }).appendTo(packsTitle);
		});
		QualityList.map(function(q) {
			$("<td></td>", { text: "G-" + q.name[0] }).appendTo(packsTitle);
		});
		$("<td></td>", { text: "dust" }).appendTo(packsTitle);

		// the edit row
		QualityList.map(function(q) {
			$("<td></td>", { text: 0, "class": "packs-edit-count" }).appendTo(packsEdit);
			$("<td></td>", { text: 0, "class": "packs-edit-count" }).appendTo(packsEdit);
		});
		$("<td></td>", { text: 0, "class": "packs-edit-dust" }).appendTo(packsEdit);
	},
	_initEventHandler: function() {
		var self = this,
			btnGolden = $(".packs-card-golden"), btnAppend = $(".packs-append"),
			cardInput = $(".packs-card-name"), qindex, golden,
			inputs = $(".packs-edit input"), counts = $(".packs-edit-count"), cell, count, tips,
			ncIndex = QualityList.length - 1, dustCount = $(".packs-edit-dust"),
			btnAdd = $(".packs-add"), btnDel = $(".packs-del"),
			rowData;

		btnGolden.toggle(
			// toggle this button between golden and normal
			function() {
				btnGolden.text("Golden");
				btnGolden.css("background-color", "#ff0");
			},
			function() {
				btnGolden.text("Normal");
				btnGolden.css("background-color", "#fff");
			}
		);
		//TODO: remove 'append' button and replace with 'reset' function
		btnAppend.click(function () {
			// verfiy the input
			if (!cardInput.val()) return;
			
			// update numbers in the editing row
			qindex = parseInt(cardInput.attr("quality-index"));
			golden = (btnGolden.text().toLowerCase() == "golden");
			cell = $(counts[qindex + (golden ? QualityList.length : 0)]);
			
			count = parseInt(cell.text());
			if (count == GameConst.CARDS_PER_PACK) return;
			cell.text(count + 1);

			tips = cell.attr("card-tips");
			cell.attr("card-tips", tips ? tips + ", " + cardInput.val() : cardInput.val());

			// update the normal common cell
			cell = $(counts[ncIndex]);
			cell.text(parseInt(cell.text()) - 1);

			// update the dust
			cell = dustCount;
			count = parseInt(cell.text()) - QualityList[ncIndex].dust; // to replace a normal common
			if (golden) {
				cell.text(count + QualityList[qindex].gdust);
			} else {
				cell.text(count + QualityList[qindex].gdust);
			}
		});

		btnAdd.click(function() {
			rowData = {
				id: parseInt($(inputs[0]).val()),
				day: $(inputs[1]).val(),
				counts: [],
				tips: [],
				dust: parseInt(dustCount.text())
			};

			// ATTENTION: in database, the golden is in front of the normal
			counts.map(function(i, ele) {
				cell = $(ele);

				if (i < QualityList.length) {
					rowData.counts.push(parseInt(cell.text()));
					rowData.tips.push(cell.attr("card-tips"));
				} else {
					rowData.counts.splice(0, 0, parseInt(cell.text()));
					rowData.tips.splice(0, 0, cell.attr("card-tips"));
				}
			});

			window.dbConn.insertPacksRow(rowData, function(tx, rs) {
				self.data.insertRow(rowData);
				self.refreshCharts();
			});
		});
		btnDel.click(function() {
			window.dbConn.deletePacksById(self.data.rows.length, function(tx, rs) {
				self.data.deleteById(self.data.rows.length);
				self.refreshCharts();
			});
		});
	},

	refreshTrendChart: function() {
		var trendChart = $(".packs-trend"), circles,
			packsData = this.data,
			lineData = [{name: 0, data: []}],
			lineOptions = {
				axis: {
					x: {
						tickWidth: 20,
						ticks: []
					},
					y: {
						min: 1,
						max: 9999,
						tickSize: 4,
						tickWidth: 30,
						rotate: 90,
						type: "logscale"
						//logbase: 10,
					}
				},
				line: {
					dots: true,
					dotRadius: 6
				},
				icons: {
					0: "circle"
				},
				threshold: {
					y: {
						value: 420
					}
				}
			};

		packsData.rows.map(function(row) {
			lineOptions.axis.x.ticks.push(row.id);
			lineData[0].data.push(row.dust);
		});

		if (this.trendChartObj) this.trendChartObj.destroy();
		this.trendChartObj = new Venus.SvgChart(trendChart.get(0), lineData, lineOptions);

		// highlight legendary cards
		circles = trendChart.find("circle");
		if (!circles || circles.length != packsData.rows.length) return;
		packsData.oranges.map(function(x) {
			var dom = circles[x-1];
			dom.highlight();
		});
	},
	refreshCountsChart: function() {
		var countTable = $(".packs-counts"),
			cells = countTable.find("td"), COL_PER_ROW = 5,
			packsData = this.data;

		QualityList.map(function(q, i) {
			cells[(i + 1) * COL_PER_ROW + 1].innerHTML = packsData.sums[i + QualityList.length];
			cells[(i + 1) * COL_PER_ROW + 2].innerHTML = "+" + (packsData.rows.length - packsData.lasts[i + QualityList.length]);
			cells[(i + 1) * COL_PER_ROW + 3].innerHTML = packsData.sums[i];
			cells[(i + 1) * COL_PER_ROW + 4].innerHTML = "+" + (packsData.rows.length - packsData.lasts[i]);
		});
	},
	refreshRatesChart: function() {
		var packsData = this.data,
			ratesChart = $(".packs-rates"),
			pieData = [],
			pieOptions = {
				pie: {
					radius: 60,
					rotate: 30
				}
			};

		if (packsData.rows.length == 0) return;

		QualityList.map(function(q, i) {
			pieData.push({name: "Golden " + q.name, data: packsData.sums[i]});
			pieData.push({name: q.name, data: packsData.sums[i + QualityList.length]});
		});

		pieData.sort(function(a, b) {
			return b.data - a.data;
		});

		if (this.ratesChartObj) this.ratesChartObj.destroy();
		this.ratesChartObj = new Venus.SvgChart(ratesChart.get(0), pieData, pieOptions);
	},
	refreshPacksEditRow: function() {
		var inputs = $(".packs-edit input"), counts = $(".packs-edit-count"),
			idInput = $(inputs[0]), dayInput = $(inputs[1]),
			ncIndex = QualityList.length - 1,
			ncCount = $(counts[ncIndex]), dustCount = $(".packs-edit-dust"),
			today = new Date(),
			y = today.getFullYear(), m = today.getMonth() + 1, d = today.getDate();

		if (m < 10) m = "0" + m;
		if (d < 10) d = "0" + d;

		// set id and the date
		idInput.val(this.data.rows.length + 1);
		dayInput.val([y, m, d].join("-"));;

		counts.map(function(i, ele) {
			ele.innerHTML = 0;
		});

		// by default, it is 5 normal common cards
		ncCount.text(GameConst.CARDS_PER_PACK);
		dustCount.text(GameConst.CARDS_PER_PACK * QualityList[ncIndex].dust);
	},
	refreshPacksTable: function() {
		var rows = this.data.rows, row,
			tbl = $(".packs-table"), tr, td;

		tbl.html("");
		for (var i = rows.length-1; i >= 0; i--) {
			row = rows[i];
			tr = $("<tr/>").appendTo(tbl);
			// row id
			$("<td/>", {
				html: row.id
			}).appendTo(tr);
			// date
			$("<td/>", {
				html: row.day,
				"class": "packs-day"
			}).appendTo(tr);

			// show the normal first, then the golden
			var offset = QualityList.length;
			for (var j = 0; j < row.counts.length; j++) {
				td = $("<td/>", {
					html: (j < offset) ? row.counts[j+offset] : row.counts[j-offset]
				}).appendTo(tr);
				if (td.html() != 0) {
					td.css("backgroundColor", "rgba(0,0,0,0.1)");

					var title = (j < offset) ? row.tips[j+offset] : row.tips[j-offset];
					td.attr("title", title ? title : "?");
				}
			}

			// dust
			$("<td/>", {
				html: row.dust
			}).appendTo(tr);
		}

		this.refreshPacksEditRow();
	},
	refreshCharts: function() {
		this.refreshTrendChart();
		this.refreshCountsChart();
		this.refreshRatesChart();
		this.refreshPacksTable();
	},
});
/* class PacksPage end */