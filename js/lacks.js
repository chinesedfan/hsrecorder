function LacksPage(container) {
	PageBase.apply(this, arguments);
}

LacksPage.prototype = {
	_initView: function() {
		var page = this;
		var td, table, div;
		CardsInfo.qualityList.map(function(q) {
			td = $("<th/>").appendTo(page.titleTrJqEle);
			td.text(q.name);
			td = $("<th/>").appendTo(page.countTrJqEle);
			td.attr("id", page.countIdPrefix + q.color);
			td.text(0);

			div = $("<div/>").appendTo(page.lacksTableJqEle);
			div.attr("class", "quarter yfull");

			table = $("<table/>").appendTo(div);
			table.attr("id", page.tableIdPrefix + q.color);
		});

		this.bottomJqEle.css("top", this.container.offsetTop);
		this.lacksTableJqEle.css("top", this.addButtonJqEle.outerHeight() + this.fixedTableJqEle.outerHeight());
	},
	_initMember: function() {
		this.container.innerHTML = HtmlTemplate.getTemplate("lacks");

		this.bottomJqEle = $("#lacks-bottom");
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

	},
	_initEventHandler: function() {
		var page = this;
		this.addButtonJqEle.click(function() {
			// verfiy the input
            var curLabelDomEle = page.autoInputObj.getSelectedLabelDomEle();
            if (!curLabelDomEle || curLabelDomEle.innerHTML != page.lacksInputJqEle.val()) return;
            // update the count
            var cell = $("#" + page.countIdPrefix + curLabelDomEle.style.color);
            var count = parseInt(cell.text());
            cell.text(count+1);
            // update the list
            var table = $("#" + page.tableIdPrefix + curLabelDomEle.style.color);
            var tr = $("<tr/>").appendTo(table);
            tr.attr("class", page.trClassPrefix + curLabelDomEle.getAttribute(page.autoInputObj.CARD_ID));
            var td = $("<td/>").appendTo(tr);
            var lbl = $(curLabelDomEle.cloneNode()).appendTo(td);
            lbl.attr("class", "");
            lbl.text(curLabelDomEle.innerHTML);
            // TODO: update the data
		});
		this.delButtonJqEle.click(function() {
			// verfiy the input
            var curLabelDomEle = page.autoInputObj.getSelectedLabelDomEle();
            if (!curLabelDomEle || curLabelDomEle.innerHTML != page.lacksInputJqEle.val()) return;
            // update the list
            var tr = $("." + page.trClassPrefix + curLabelDomEle.getAttribute(page.autoInputObj.CARD_ID));
            if (tr.length == 0) return;
            tr[0].remove();
            // update the count
            var cell = $("#" + page.countIdPrefix + curLabelDomEle.style.color);
            var count = parseInt(cell.text());
            cell.text(count-1);
            // TODO: update the data
		});
	},
}