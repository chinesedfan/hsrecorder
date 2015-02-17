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
			if (i > 0) {
				self.lasts[i] = rowData.id;
			}
		});

		if (rowData.counts[0] > 0 || rowData.counts[QualityList.length] > 0) {
			self.oranges.push(rowData.id);
		}

		self.rows.push(rowData);
	},
	deleteById: function(id) {

	}
}

/* class PacksPage begin */
function PacksPage(container) {
	PageBase.apply(this, arguments);
}

PacksPage.prototype = {
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
			btnAdd = $(".packs-add"), btnDel = $(".packs-del"),
			packsEdit = $(".packs-edit"), rowData;

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
		btnAppend.click(function () {
			// verfiy the input
			var curLabelDomEle = page.autoInputObj.getSelectedLabelDomEle();
			if (!curLabelDomEle || curLabelDomEle.innerHTML != page.cardInputJqEle.val()) return;
			// update numbers in the editing row
			var prefix = page.goldenButtonJqEle.text().toLowerCase();
			var cell = $("#" + prefix + "-" + curLabelDomEle.style.color);
			var count = parseInt(cell.text());
			if (count == 5) return;
			cell.text(count+1);
			var tip = cell.attr("title");
			cell.attr("title", tip ? tip + "\n" + curLabelDomEle.innerHTML : curLabelDomEle.innerHTML);
			// update the normal common cell
			page.editingCellCJqEle.text(parseInt(page.editingCellCJqEle.text()) - 1);
			// update the dust
			cell = page.editingCellDustJqEle;
			count = parseInt(cell.text()) - 5; // to replace a normal common
			var index = curLabelDomEle.getAttribute(page.autoInputObj.QUALITY_INDEX);
			if (prefix == "golden") {
				cell.text(count + CardsInfo.qualityList[index].gdust);
			} else {
				cell.text(count + CardsInfo.qualityList[index].dust);
			}
		});

		btnAdd.click(function() {
			rowData = {};

			window.dbConn.insertPacksData(rowData, function(tx, rs) {
				self.data.insertRow(rowData);
				self.refreshCharts();
			});

			var row = {};
			row.counts = [];
			row.tips = [];

			var i = 0; 
			var tdDomEleList = page.editingRowJqEle.children();
			// remember they have an inner input box
			row.id = parseInt(tdDomEleList.get(i++).children[0].value);
			row.day = tdDomEleList.get(i++).children[0].value;

			// [0, len - 1] -> [len, 2*len - 1], [len, 2*len - 1] -> [0, len - 1]
			for (var j = 0, len = CardsInfo.qualityList.length; j < len; i++, j++) {
				row.counts[j] = parseInt(tdDomEleList.get(i+len).innerHTML);
				row.counts[j+len] = parseInt(tdDomEleList.get(i).innerHTML);

				row.tips[j] = tdDomEleList.get(i+len).title;
				row.tips[j+len] = tdDomEleList.get(i).title;
			};
			row.dust = parseInt(tdDomEleList.get(tdDomEleList.length-1).innerHTML);

			page._dbConn.insertPacksData(page, row);
		});
		btnDel.click(function() {
			var row = {};
			row.id = page.packsData.rows.length;
			page._dbConn.deletePacksData(page, row);
		});
	},

	_showDustTrend: function(container, lineTicks, dustData) {
		if (dustData.length == 0) return null;

		var lineOptions = {
			axis: {
				x: {
					tickWidth: 20,
					ticks: lineTicks,
				},
				y: {
					min: 1,
					max: 9999,
					tickSize: 4,
					tickWidth: 30,
					rotate: 90,
					type: "logscale",
					//logbase: 10,
				},
			},
			line: {
				dots: true,
				dotRadius: 6,
			},
			icons: {
				0: "circle",
			},
			threshold: {
				y: {
					value: 420,
				},
			},
		};
		var lineData = [{name: 0, data: dustData}];
		var line = new Venus.SvgChart(container, lineData, lineOptions);
		return line;
	},
	_showQualityCounts: function(container, qualityData) {
		if (eval(qualityData.join("+")) == 0) return null;

		var barTicks = CardsInfo.qualityNames;
		var barOptions = {
			axis: {
				x: {
					total: 9,
					tickWidth: 60,
					ticks: barTicks,
					labelRotate: 30,
				},
				y: {
					min: 0,
					tickSize: 2,
					tickWidth: 16,
					rotate: 90,
				},
			},
			bar: {
				radius: 0,
			},
		};
		var arr1 = {}, arr2 = {};
		for (var i = 0; i < barTicks.length; i++) {
			arr1[barTicks[i]] = qualityData[i];
			arr2[barTicks[i]] = qualityData[i+barTicks.length];
		}
		var barData = [{name: "golden", data: arr1}, {name: "normal", data: arr2}];
		var bar = new Venus.SvgChart(container, barData, barOptions);
		return bar;
	},
	_showQualityRates: function(container, qualityData) {
		// avoid the chart library to crash
		if (eval(qualityData.join("+")) == 0) return null;

		var pieOptions = {
			pie: {
				radius: 60,
				rotate: 30, 
			},
		};
		var pieData = [];
		for (var i = 0; i < CardsInfo.qualityNames.length; i++) {
			pieData.push({name: "Golden " + CardsInfo.qualityNames[i], data: qualityData[i]});
			pieData.push({name: CardsInfo.qualityNames[i], data: qualityData[i+CardsInfo.qualityNames.length]});
		}

		pieData.sort(function(a, b) {
			return b.data - a.data;
		});
		var pie = new Venus.SvgChart(container, pieData, pieOptions);
		return pie;
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
		this.countsChartDomEle.innerHTML = "";

		var tbl, tr;
		tbl = $("<table/>", {
			"class": "table table-boarded"
		}).appendTo(this.countsChartDomEle);

		tr = $("<tr><td/><td>Normal</td><td/><td>Golden</td><td/></tr>").appendTo(tbl);
		for (var i = 0; i < CardsInfo.qualityList.length; i++) {
			tr = $("<tr/>").appendTo(tbl);
			// quality name
			$("<td/>", {
				text: CardsInfo.qualityList[i].name,
				css: {color: CardsInfo.qualityList[i].color}
			}).appendTo(tr);
			// normal count
			$("<td/>", {
				text: this.packsData.sums[i+CardsInfo.qualityList.length]
			}).appendTo(tr);
			// normal distance
			$("<td/>", {
				text: "+" + (this.packsData.rows.length - this.packsData.lasts[i+CardsInfo.qualityList.length]),
				css: {color: "red"}
			}).appendTo(tr);
			// golden count
			$("<td/>", {
				text: this.packsData.sums[i]
			}).appendTo(tr);
			// golden distance
			$("<td/>", {
				text: "+" + (this.packsData.rows.length - this.packsData.lasts[i]),
				css: {color: "red"}
			}).appendTo(tr);
		}
	},
	refreshRatesChart: function() {
		if (this.ratesObj) this.ratesObj.destroy();

		this.ratesObj = this._showQualityRates(this.ratesChartDomEle, this.packsData.sums);
	},
	refreshPacksEditRow: function() {
		this.editIdJqEle.val(this.packsData.rows.length + 1);

		var today = new Date();
		var month = today.getMonth()+1; // the special one
		this.editDayJqEle.val(today.getFullYear() + "-" 
			+ ((month>9) ? month : ("0"+month)) + "-"
			+ ((today.getDate()>9) ? today.getDate() : ("0"+today.getDate())));

		var trEdit = this.editingRowJqEle;
		for (var i = 2; i < trEdit.children().length; i++) {
			trEdit.children().get(i).innerHTML = 0;
			trEdit.children().get(i).title = "";
		}

		// by default, it is 5 normal common cards
		this.editingCellCJqEle.text(5);
		this.editingCellDustJqEle.text(25);
	},
	refreshPacksTable: function() {
		this.packsTableJqEle.empty();

		var rows = this.packsData.rows, row,
			tbl = $("<table/>"), tr, td;
		for (var i = rows.length-1; i >= 0; i--) {
			row = rows[i];
			tr = $("<tr/>").appendTo(tbl);
			// row id
			$("<td/>", {
				html: row.id,
				"class": "othertd",
			}).appendTo(tr);
			// date
			$("<td/>", {
				html: row.day,
				"class": "datetd",
			}).appendTo(tr);

			// show the normal first, then the golden
			var offset = CardsInfo.qualityList.length;
			for (var j = 0; j < row.counts.length; j++) {
				td = $("<td/>", {
					html: (j < offset) ? row.counts[j+offset] : row.counts[j-offset],
					"class": "othertd"
				}).appendTo(tr);
				if (td.html() != 0) {
					td.css("backgroundColor", "rgba(0,0,0,0.1)");

					var title = (j < offset) ? row.tips[j+offset] : row.tips[j-offset];
					td.attr("title", title ? title : "?");
				}
			}

			// dust
			$("<td/>", {
				html: row.dust,
				"class": "othertd"
			}).appendTo(tr);
		}
		this.packsTableJqEle.append(tbl);

		this.refreshPacksEditRow();
	},
	refreshCharts: function() {
		this.refreshTrendChart();return;
		this.refreshCountsChart();
		this.refreshRatesChart();
		this.refreshPacksTable();
	},
}
$.extend(PacksPage.prototype, PageBase.prototype);
/* class PacksPage end */