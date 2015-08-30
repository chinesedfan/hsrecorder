/* class ExportPage begin */
function ExportPage() {
	PageBase.apply(this, arguments);
}

$.extend(ExportPage.prototype, PageBase.prototype);
$.extend(ExportPage.prototype, {
	constructor: ExportPage,
	_initEventHandler: function() {
		var textArea = $(".export-content"),
			total, success,
			progressTitle = $(".progress-title"),
			progressBar = $(".progress-bar");

		function resetProgress(n) {
			total = n;
			success = 0;
			progressTitle.text("0/" + total);
			progressBar.css("width", "0%");
		}
		function updateProgress() {
			success++;
			progressTitle.text(success + "/" + total);
			progressBar.css("width", success*100/total + "%");
		}

		$(".export-export").click(function() {
			resetProgress(3);
			window.setTimeout(function() {
				window.dbConn.showExportedSqls(textArea, function() {
					updateProgress();
				});
			}, 200);
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

			resetProgress(n);
			window.setTimeout(function() {
				window.dbConn.execSqls(sqls, function(tx, rs) {
					updateProgress();
				});
			}, 200);
		});
	}
});
/* class ExportPage end */
