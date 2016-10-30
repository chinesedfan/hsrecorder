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
        detail: [object], {series: {cls: {rarity: {count, current}}}}
*/
function LacksData(rows) {
	var i = 0, n = rows.length,
		qlen = QualityList.length,
		row, rowData;

	this.rows = [];
	this.counts = new SameArray(qlen, 0);
    this.detail = new CardDetails();

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
        this.detail.addLack(rowData.id);
	},
	deleteById: function(id) {
		var rowData = this.rows.pop(); //TODO: not the last only

		this.counts[rowData.quality]--;
        this.detail.delLack(rowData.id);
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
            self.refreshLacksDetail();
		});

		self.countIdPrefix = "lacks-count-";
		self.tableIdPrefix = "lacks-table-";
		self.trClassPrefix = "J_lacks-tr-";
	},
	_initView: function() {
		var self = this,
            lacksDetail = $('.lacks-detail'),
			lacksTitle = $(".lacks-title"), lacksCount = $(".lacks-count"),
			lacksNames = $(".lacks-names");
        var TOTAL = 'Total';

		new AutoInput($(".lacks-card"));

        GameConst.SERIES_LIST.concat([TOTAL]).forEach(function(series, si) {
            var thtr, tr, td;
            if (si == 0) {
                thtr = $('<tr></tr').appendTo(lacksDetail);
            }

            QualityList.concat([TOTAL]).reverse().forEach(function(q, qi) {
                tr = $('<tr></tr>').addClass(qi == 0 ? 'total' : 'detail hidden').appendTo(lacksDetail);
                if (qi == 0 || qi == 1) {
                    tr.css({
                        'border-top': '1px solid #d7d7d7'
                    });
                }

                GameConst.CLASS_LIST.concat(['Neutral', TOTAL]).forEach(function(cls, ci) {
                    if (si == 0 && qi == 0) {
                        if (ci == 0) {
                            $('<th></th>').appendTo(thtr);
                        }
                        $('<th></th>').text(cls).appendTo(thtr);
                    }
                    if (ci == 0) {
                        $('<td></td>').text(qi == 0 ? series : '')
                            .css('font-weight', 'bold')
                            .appendTo(tr);
                    }

                    td = $('<td></td>').attr({
                        'class': 'J_lacks-detail',
                        'data-series': series,
                        'data-cls': cls,
                        'data-rarity': q.name || q
                    }).css({
                        'color': q.color || ''
                    }).text(CardCounts[series][cls][q.name ? q.name : q] || 0).appendTo(tr);
                });
            });
        });
		QualityList.map(function(q) {
			$("<th></th>", { text: q.name }).appendTo(lacksTitle);
			$("<th id=\"" +self.countIdPrefix + q.color + "\">0</th>").appendTo(lacksCount);

			$("<div><table id=\"" + self.tableIdPrefix + q.color + "\"></table></div>").appendTo(lacksNames);
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

        // toggle detail
        $('.lacks-detail tr.total').click(function(e) {
            var ele = $(e.currentTarget);
            if (ele.next().hasClass('hidden')) {
                $('.lacks-detail tr.detail').addClass('hidden');
            }

            var selfHidden = true;
            for (var i = 0; i < 4; i++) {
                ele = ele.next();
                if (ele.hasClass('hidden')) {
                    ele.removeClass('hidden');
                } else {
                    ele.addClass('hidden');
                }
            }
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
			cardId = tr.attr('class').replace(/^J_lacks-tr-/, '');
			src = 'http://i1.17173cdn.com/8hpoty/YWxqaGBf/images/resource/new_middler/' + cardId + '.png';

		var previewDiv = $('.lacks-preview'),
			previewImg = $('img', previewDiv);

		tr.css('background-color', '#f0f0f0');
		previewImg.attr('data-src', src);

		window.setTimeout(function() {
			// has been changed, then ignore
			if (previewImg.attr('data-src') != src) return;

			previewImg.attr('src', src)
					.off('load') // clear other handlers
					.on('load', function() {
						if (previewDiv.width() == 8 && /_|-/.test(src)) {
							// the second chance
							previewImg.attr('src', src.replace(/_|-/, ' '));
						} else {
							doShow();
						}
					});
		}, 200);

		function doShow() {
			previewDiv.css({
				left: $('.lacks-left').width() + offset.left - previewDiv.width(),
				top: Math.max(0, offset.top - previewDiv.height())
			}).show();
		}
	},
	hideCardPreview: function(e) {
		var tr = $(this),
			previewDiv = $('.lacks-preview'),
			previewImg = $('img', previewDiv);

		tr.css('background-color', '#fff');
		previewImg.attr('data-src', '');
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
    refreshLacksDetail: function() {
        var self = this;
        var TOTAL = 'Total';

        $('.J_lacks-detail').each(function(i, ele) {
            ele = $(ele);

            var series = ele.attr('data-series');
            var cls = ele.attr('data-cls');
            var rarity = ele.attr('data-rarity');

            var current = self.data.detail.current[series][cls][rarity] || 0;
            var expected = self.data.detail.expected[series][cls][rarity] || 0;

            if (current == expected) {
                ele.html(expected).css({
                    'background-color': '#fff'
                });
            } else {
                ele.html(current + '/' + expected).css({
                    'background-color': '#e1e1e1'
                });
            }
        });
    }
});
/* class LacksPage end */