/* class ExportPage begin */
function ExportPage() {
	PageBase.apply(this, arguments);
}

$.extend(ExportPage.prototype, PageBase.prototype);
$.extend(ExportPage.prototype, {
	constructor: ExportPage,
	_initEventHandler: function() {
		var textArea = $(".export-content"),
			progressTitle = $(".progress-title"),
			progressBar = $(".progress-bar");

		$(".export-export").click(function() {
			window.dbConn.showExportedSqls(textArea);
		});
		$(".export-import").click(function() {
			var success = 0,
				sqls = textArea.val().split(';\n'), n = sqls.length;

			if (!n) return;
			// if the script ends with a comma, we should ignore the last empty item
			if (!sqls[sqls.length - 1]) {
				sqls.pop();
				if (--n == 0) return;
			}

			progressTitle.text("0/" + n);
			progressBar.css("width", "0%");
			window.dbConn.execSqls(sqls, function(tx, rs) {
				progressBar.css("width", (++success)*100/n + "%");
				progressTitle.text(success + "/" + n);
			});
		});
	}
});
/* class ExportPage end */
