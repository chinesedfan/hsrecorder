function LacksPage(container) {
	PageBase.apply(this, arguments);
}

LacksPage.prototype = {
	_initView: function() {
		var page = this;
		this.controllAreaJqEle.css("width", "30%");
		this.controllAreaJqEle.css("height", this.addButtonJqEle.outerHeight());
		this.controllAreaJqEle.css("margin", "20px auto 20px auto");

		CardsInfo.qualityList.map(function(q) {
			// title
			$("<th/>", {
				text: q.name
			}).appendTo(page.titleTrJqEle);
			// count
			$("<th/>", {
				id: page.countIdPrefix + q.color,
				text: 0
			}).appendTo(page.countTrJqEle);

			var div = $("<div/>", {
			    "class": "quarter yfull yscrolled"
			}).appendTo(page.lacksTableJqEle);

			$("<table/>", {
				id: page.tableIdPrefix + q.color
			}).appendTo(div);
		});

		this.bottomJqEle.css("top", this.container.offsetTop);
		this.lacksTableJqEle.css("top", this.controllAreaJqEle.outerHeight(true) + this.fixedTableJqEle.outerHeight());
	},
	_initMember: function() {
		this._dbConn = window.dbConn;
		this.container.innerHTML = HtmlTemplate.getTemplate("lacks");

		this.bottomJqEle = $("#lacks-bottom");
		this.controllAreaJqEle = $("#lacks-controll");
		this.fixedTableJqEle = $("#lacks-fixed");
		this.lacksTableJqEle = $("#lacks-table");

		this.titleTrJqEle = $("#lacks-title");
		this.countTrJqEle = $("#lacks-count");

		this.lacksInputJqEle = $("#lacks-input");
		this.autoInputJqEle = $("#lacks-auto");
		this.addButtonJqEle = $("#lacks-add");
		this.delButtonJqEle = $("#lacks-del");
		this.autoInputObj = new AutoInput(this.lacksInputJqEle, this.autoInputJqEle);

		this.countIdPrefix = "lacks-"; // + color
		this.tableIdPrefix = "table-"; // + color
		this.trClassPrefix = "Tag-tr-";   // + card_id
	},
	_initData: function() {
		this._dbConn.loadLacksData(this);	
	},
	_initEventHandler: function() {
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
		for (var i = 0; i < this.lacksData.rows.length; i++) {
			this.insertCard(this.lacksData.rows[i], false);
		}
	},
}