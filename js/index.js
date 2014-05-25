/* class PageBase begin */
function PageBase(container) {
    this.container = container;

    // initialize HTML elements
    this._initView();
    // add other fields of this class besides this.container
    this._initMember();
    // load datas for the database
    this._initData();
    // register event handers
    this._initEventHandler();
}
/* class PageBase end */

/* class MainPage begin */
function MainPage() {    
    PageBase.apply(this, arguments);
}

MainPage.prototype = {
    _initView: function() {
        // because this page is not reusable, all elements are defined in HTML directly

        this._subpages = [
            {index: 0, id: "arena-frame", constructor: ArenaPage, initialized: false},
            {index: 1, id: "packs-frame", constructor: PacksPage, initialized: false},
        ];
        this.headerListJqEle = $("#header-div li");
        this.showSubPage(0);
    },
    _initMember: function() {
        this._dbConn = new DbConn();        
    },
    _initData: function() {
        this._dbConn.initDB();
    },
    _initEventHandler: function() {
        var page = this;
        this._subpages.map(function(sp) {
            var domEle = page.headerListJqEle[sp.index];
            domEle.onclick = function() {
                page.showSubPage(sp.index);
            };
        });
    },

    showSubPage: function(index) {
        var page = this;
        var subpage = this._subpages[index];
        this._subpages.map(function(sp) {
            var domEle = document.getElementById(sp.id);
            var isShow = (sp.id == subpage.id);
            if (!sp.initialized) {
                if (isShow) {
                    new (sp.constructor)(document.getElementById(sp.id));
                    sp.initialized = true;
                }
            } else {
                domEle.style.display = isShow ? "table-row" : "none";
            }
            page.headerListJqEle[sp.index].className = isShow ? "active" : "";
        });
    },
}
/* class MainPage end */

window.onload = function() {
    new MainPage(document.getElementById("header-div"));
};