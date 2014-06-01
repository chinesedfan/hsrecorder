var HtmlTemplate = (function() {
    function _arenaTemplate() {
/*
	<div id="trend-chart" class="chart center"></div>
    <div id="arena-bottom" class="bottom">
        <div class="half yfull">
            <div id="wins-chart" class="chart"></div>
            <div id="rates-chart" class="bottom"></div>
        </div>
    	<div class="half yfull">
    		<div>
    			<button id="add-btn" class="half btn btn-default col-md-6">Add Editing</button>
    			<button id="del-btn" class="half btn btn-default col-md-6">Remove Last</button>
    		</div>
    		<table id="arena-fixed" class="table-fixed">
    			<tr><th>id</th><th>day</th><th>class</th><th>wins</th></tr>
    			<tr id="edit-row">
                    <td><input id="edit-id" class="form-control"></td>
                    <td><input id="edit-day" class="form-control"></td>
                    <td><select id="edit-class" class="form-control"></td>
                    <td><input id="edit-wins" class="form-control"></td>
                </tr>
    		</table>
    		<div id="arena-table" class="bottom yscrolled"></div>
    	</div>
    </div>
*/
    }
    function _packsTemplate() {
/*
    <div id="packs-trend" class="chart"></div>
    <div id="packs-bottom" class="bottom">
        <div class="half yfull">
            <div id="quality-parts" class="chart center"></div>
            <div id="quality-rates" class="bottom"></div>
        </div>
        <div class="half yfull">
            <div>
                <button id="golden-btn" class="quarter btn btn-default">Normal</button>
                <input id="card-input" class="half form-control">
                <div id="auto-input" class="auto-input"></div>
                <button id="append-btn" class="quarter btn btn-default">Append</button>
            </div>
            <table id="packs-fixed" class="table-fixed"></table>
            <div>
                <button id="packs-add" class="half btn btn-default">Add Editing</button>
                <button id="packs-del" class="half btn btn-default">Remove Last</button>
            </div>
            <div id="packs-table" class="bottom yscrolled"></div>
    </div>
*/
    }
    function _lacksTemplate() {
/*
    <div id="lacks-bottom" class="bottom">
        <div id="lacks-controll">
            <input id="lacks-input" class="half form-control">
            <div id="lacks-auto" class="auto-input"></div>
            <button id="lacks-add" class="quarter btn btn-default">Insert</button>
            <button id="lacks-del" class="quarter btn btn-default">Delete</button>
        </div>
        <table id="lacks-fixed" class="table-fixed">
            <tr id="lacks-title"></tr>
            <tr id="lacks-count"></tr>
        </table>
        <div id="lacks-table" class="bottom yscrolled"></div>
    </div>
*/
    }

    var _funcMap = {
        arena: _arenaTemplate,
        packs: _packsTemplate,
        lacks: _lacksTemplate,
    };

    function _getTemplate(key) {
        var func = _funcMap[key];
        return func ? func.toString().split('\n').slice(2,-2).join('\n') : "";
    }

    return {
        getTemplate: _getTemplate,
    }
})();