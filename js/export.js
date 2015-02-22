/* class ExportPage begin */
function ExportPage() {    
    PageBase.apply(this, arguments);
}

$.extend(ExportPage.prototype, PageBase.prototype);
$.extend(ExportPage.prototype, {
    constructor: ExportPage,
    _initEventHandler: function() {
        var textArea = $(".export-content");

        $(".export-export").click(function() {
            window.dbConn.showExportedSqls(textArea);
        });
        $(".export-import").click(function() {
            window.dbConn.execSqlScript(textArea.val());
        });
    }
});
/* class ExportPage end */
