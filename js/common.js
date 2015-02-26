/* class SameArray begin */
function SameArray(n, val) {
	var arr = new Array(), i;

	for (i = 0; i < n; i++) {
		arr.push(val);
	}
	return arr;
}
/* class SameArray end */

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
PageBase.prototype._initData = function() {};
PageBase.prototype._initView = function() {};
PageBase.prototype._initEventHandler = function() {};
/* class PageBase end */

var GameConst = {
	CLASS_LIST: ["Druid", "Hunter", "Mage", "Paladin", "Priest", "Rogue", "Shaman", "Warlock", "Warrior"],
	MAX_ARENA_WINS: 12,
	RARITY_MAX: 5
};
var QualityList = [
	{name: "Legendary", color: "orange", dust: 400, gdust: 1600},
	{name: "Epic", color: "purple", dust: 100, gdust: 400},
	{name: "Rare", color: "blue", dust: 20, gdust: 100},
	{name: "Common", color: "black", dust: 5, gdust: 50}
];