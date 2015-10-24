/*
	@param:
		rows: [rowObject], list of database rows
	@member:
		rows: [object]
			id: integer, card id definded in cards.js
			name: string
			quality: integer, index for QualityList (defined in common.js)
			color: string
		counts: [integer], length = qualities
*/
function LacksData(rows) {
	var i = 0, n = rows.length,
		qlen = QualityList.length,
		row, rowData;

	this.rows = [];
	this.counts = new SameArray(qlen, 0);

	for (; i < n; i++) {
		row = rows.item(i);
		rowData = {
			id: row.card_id,
			name: row.card_name,
			quality: row.card_quality,
			color: QualityList[row.card_quality].color
		}

		this.insertRow(rowData);
	}
}

LacksData.prototype = {
	insertRow: function(rowData) {
		this.counts[rowData.quality]++;
		this.rows.push(rowData);
	},
	deleteById: function(id) {
		var rowData = this.rows.pop(); //TODO: not the last only

		this.counts[rowData.quality]--;
	}
}

/* class LacksPage begin */
function LacksPage(container) {
	PageBase.apply(this, arguments);
}

$.extend(LacksPage.prototype, PageBase.prototype);
$.extend(LacksPage.prototype, {
	_initData: function() {
		var self = this;

		window.dbConn.loadLacksData(function(tx, rs) {
			self.data = new LacksData(rs.rows);
			self.refreshLacksTable();
		});

		self.countIdPrefix = "lacks-count-";
		self.tableIdPrefix = "lacks-table-";
		self.trClassPrefix = "J_lacks-tr-";
	},
	_initView: function() {
		var self = this,
			lacksTitle = $(".lacks-title"), lacksCount = $(".lacks-count"),
			bottom = $(".lacks-bottom");

		new AutoInput($(".lacks-card"));

		QualityList.map(function(q) {
			$("<th></th>", { text: q.name }).appendTo(lacksTitle);
			$("<th id=\"" +self.countIdPrefix + q.color + "\">0</th>").appendTo(lacksCount);

			$("<div><table id=\"" + self.tableIdPrefix + q.color + "\"></table></div>").appendTo(bottom);
		});
	},
	_initEventHandler: function() {
		var self = this, rowData;

		$(".lacks-add").click(function() {
			rowData = self._getRowData();
			if (!rowData) return;

			window.dbConn.insertLacksRow(rowData, function(tx, rs) {
				self.data.insertRow(rowData);
				self.insertCard(rowData, true);
			});
		});
		$(".lacks-del").click(function() {
			rowData = self._getRowData();
			if (!rowData) return;

			window.dbConn.deleteLacksById(rowData.id, function(tx, rs) {
				self.data.deleteById(rowData.id);
				self.deleteCard(rowData);
			});
		});
	},

	_getRowData: function() {
		var cardInput = $(".lacks-card");

		if (cardInput.val() == "") return null;

		return {
			id: cardInput.attr("card-id"),
			name: cardInput.val(),
			quality: cardInput.attr("quality-index"),
			color: cardInput.get(0).style.color
		};
	},
	showCardPreview: function(e) {
		var tr = $(this),
			offset = tr.position(),
			cardName = $('label', tr).text(),
			src = 'http://img.dwstatic.com/ls/pic/card/' + cardName + '.png';

		var previewDiv = $('.lacks-preview'),
			previewImg = $('img', previewDiv);

		tr.css('background-color', '#f0f0f0');

		if (previewImg.attr('src') == src) {
			doShow();
			return;
		} else {
			previewImg.attr('src', src).on('load', doShow);
		}

		function doShow() {
			previewDiv.css({
				left: offset.left + tr.width() - previewDiv.width(),
				top: Math.max(0, offset.top - previewDiv.height())
			}).show();
		}
	},
	hideCardPreview: function(e) {
		var tr = $(this),
			previewDiv = $('.lacks-preview');

		tr.css('background-color', '#fff');
		previewDiv.hide();
	},
	insertCard: function(row, isNew) {
		var table, tr, td, lbl, span, count;

		// update the list
		table = $("#" + this.tableIdPrefix + row.color);
		tr = $("<tr/>", { "class": this.trClassPrefix + row.id })
				.on('mouseenter', this.showCardPreview)
				.on('mouseleave', this.hideCardPreview)
				.appendTo(table);
		td = $("<td/>").appendTo(tr);
		lbl = $("<label/>", { css: {color: row.color}, text: row.name }).appendTo(td);
		if (isNew) {
			span = $("<span/>").appendTo(td);
			span.css("color", "red");
			span.text(" new!");
		}

		// update the count
		count = $("#" + this.countIdPrefix + row.color);
		count.text(parseInt(count.text()) + 1);
	},
	deleteCard: function(row) {
		var trs, tr, label, span,
			count;

		// update the list
		trs = $("." + this.trClassPrefix + row.id);
		if (trs.length == 0) return; // not found
		
		trs.each(function(i, ele) {
			tr = $(ele);
			label = $(tr.find("label"));

			if (label.css("text-decoration") != "line-through") {
				span = $(tr.find("span"));
				if (span) span.remove();

				label.css("text-decoration", "line-through");
				return false;
			}
			return true;
		});

		// update the count
		count = $("#" + this.countIdPrefix + row.color);
		count.text(parseInt(count.text()) - 1);
	},
	refreshLacksTable: function() {
		for (var i = 0; i < this.data.rows.length; i++) {
			this.insertCard(this.data.rows[i], false);
		}
	},
});
/* class LacksPage end */