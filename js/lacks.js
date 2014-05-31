function LacksPage(container) {
	PageBase.apply(this, arguments);
}

LacksPage.prototype = {
	_initView: function() {
		var page = this;
		var td;
		CardsInfo.qualityList.map(function(q) {
			td = $("<th/>").appendTo(page.titleTrJqEle);
			td.text(q.name);
			td = $("<th/>").appendTo(page.countTrJqEle);
			td.attr("id", "lacks-" + q.color);
			td.text(0);
		});

		this.bottomJqEle.css("position", "relative");
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
		this.autoInputObj = new AutoInput(this.lacksInputJqEle, this.autoInputJqEle);
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
            var cell = $("#lacks-" + curLabelDomEle.style.color);
            var count = parseInt(cell.text());
            cell.text(count+1);
            // TODO: update the list
		});
	},
}