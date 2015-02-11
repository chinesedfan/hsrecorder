/* class ZeroArray begin */
function ZeroArray(n) {
	Array.apply(this);

	for (var i = 0; i < n; i++) {
		this.push(0);
	}
}

//ZeroArray.prototype = $.extend({
//	constructor: ZeroArray
//}, Array.prototype);
ZeroArray.prototype = new Array();
/* class ZeroArray end */

/* class PageBase begin */
function PageBase(container) {
	// initialize HTML elements
	this._initHtml(container);
	// load datas for the database
	this._initData();
	// update the view with datas
	this._initView();
	// register event handers
	this._initEventHandler();
}

PageBase.prototype._initHtml = function(container) {
	var key = container.attr("page-template"),
		template = $("#" + key);

	container.html(template.html());
};
/* class PageBase end */

var GameConst = {
	CLASS_LIST: ["Druid", "Hunter", "Mage", "Paladin", "Priest", "Rogue", "Shaman", "Warlock", "Warrior"],
	MAX_ARENA_WINS: 12
};
var QualityList = [
	{name: "Legendary", color: "orange", dust: 400, gdust: 1600},
	{name: "Epic", color: "purple", dust: 100, gdust: 400},
	{name: "Rare", color: "blue", dust: 20, gdust: 100},
	{name: "Common", color: "black", dust: 5, gdust: 50}
];