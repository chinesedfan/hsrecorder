/*
	@param:
		rows: [rowObject], list of database rows
	@member:
        rows: [object]
            id: integer, card id definded in cards.js
            name: string
            quality: integer, index for CardsInfo.qualityList
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

	}
}

/* class LacksPage begin */
function LacksPage(container) {
	PageBase.apply(this, arguments);
}

LacksPage.prototype = {
	_initData: function() {
		var self = this;

		window.dbConn.loadLacksData(function(tx, rs) {
			self.data = new LacksData(rs.rows);
			self.refreshLacksTable();
		});

		self.countIdPrefix = "lacks-count-";
		self.tableIdPrefix = "lacks-table-";
	},
	_initView: function() {
		var self = this,
			lacksTitle = $(".lacks-title"), lacksCount = $(".lacks-count"),
			bottom = $(".lacks-bottom");

		QualityList.map(function(q) {
			$("<th></th>", { text: q.name }).appendTo(lacksTitle);
			$("<th id=\"" +self.countIdPrefix + q.color + "\">0</th>").appendTo(lacksCount);

			$("<div><table id=\"" + self.tableIdPrefix + q.color + "\"></table></div>").appendTo(bottom);
		});
	},
	_initEventHandler: function() {
		return;
		var page = this;
		function _labelToRow(curLabelDomEle) {
			var row = {};
            row.id = curLabelDomEle.getAttribute(page.autoInputObj.CARD_ID);
            row.name = curLabelDomEle.innerHTML;
            row.quality = curLabelDomEle.getAttribute(page.autoInputObj.QUALITY_INDEX);
            row.color = curLabelDomEle.style.color;
            return row;
		}

		this.addButtonJqEle.click(function() {
			// verfiy the input
            var curLabelDomEle = page.autoInputObj.getSelectedLabelDomEle();
            if (!curLabelDomEle || curLabelDomEle.innerHTML != page.lacksInputJqEle.val()) return;
                        
            page._dbConn.insertLacksData(page, _labelToRow(curLabelDomEle));
		});
		this.delButtonJqEle.click(function() {
			// verfiy the input
            var curLabelDomEle = page.autoInputObj.getSelectedLabelDomEle();
            if (!curLabelDomEle || curLabelDomEle.innerHTML != page.lacksInputJqEle.val()) return;

            page._dbConn.deleteLacksData(page, _labelToRow(curLabelDomEle));
		});
	},

	insertCard: function(row, isNew) {
        // update the list
        var table = $("#" + this.tableIdPrefix + row.color);
        var tr = $("<tr/>", {
            "class": this.trClassPrefix + row.id
        }).appendTo(table);
        var td = $("<td/>").appendTo(tr);
        var lbl = $("<label/>", {
        	css: {color: row.color},
        	text: row.name
        }).appendTo(td);
        var span = $("<span/>").appendTo(td);
        if (isNew) {
	        span.css("color", "red");
	        span.text(" new!");
        }
		// update the count
        var cell = $("#" + this.countIdPrefix + row.color);
        var count = parseInt(cell.text());
        cell.text(count+1);
	},
	deleteCard: function(row) {
	    // update the list
        var tr = $("." + this.trClassPrefix + row.id);
        if (tr.length == 0) return; // not found
        
        var i = 0;
        var td = tr[i].children[0];
        while(td.children[0].style.textDecoration == "line-through" && i < tr.length) {
        	td = tr[++i].children[0];
        }
        while (td.children.length > 1) td.children[1].remove();
        td.children[0].style.textDecoration = "line-through";

        // update the count
        var cell = $("#" + this.countIdPrefix + row.color);
        var count = parseInt(cell.text());
        cell.text(count-1);
	},
	refreshLacksTable: function() {
		for (var i = 0; i < this.data.rows.length; i++) {
			this.insertCard(this.data.rows[i], false);
		}
	},
}
$.extend(LacksPage.prototype, PageBase.prototype);
/* class LacksPage end */