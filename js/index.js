/* class PageBase begin */
function PageBase(container) {
    this.container = container;

    // add other fields of this class besides this.container
    this._initMember();
    // initialize HTML elements
    this._initView();
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

        this.showSubPage(0);
    },
    _initMember: function() {
        this._dbConn = window.dbConn;
        this._subpages = [
            {index: 0, id: "arena-frame", constructor: ArenaPage, initialized: false},
            {index: 1, id: "packs-frame", constructor: PacksPage, initialized: false},
            {index: 2, id: "lacks-frame", constructor: LacksPage, initialized: false},
            {index: 3, id: "export-frame", constructor: ExportPage, initialized: false}
        ];
        this.pagesArr = new Array(this._subpages.length);
        this.headerListJqEle = $("#header-div li");        

        // initialize the database before show any page
        this._dbConn.initDB();        
    },
    _initData: function() {
        // do nothing
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

    _initSubPage: function(page, sp) {
        if (!sp.initialized) {
            page.pagesArr[sp.index] = new (sp.constructor)(document.getElementById(sp.id));
            sp.initialized = true;
        }
    },
    showSubPage: function(index) {
        var page = this;
        this._subpages.map(function(sp) {
            document.getElementById(sp.id).style.display = "none";
            page.headerListJqEle[sp.index].className = "";
        });

        var sp = this._subpages[index];
        document.getElementById(sp.id).style.display = "table-row";
        this._initSubPage(this, sp);
        
        page.headerListJqEle[sp.index].className = "active";
    },
    initAllSubPages: function() {
        var page = this;
        this._subpages.map(function(sp) {
            page._initSubPage(page, sp);
        });
    }
}
/* class MainPage end */

window.onload = function() {
    window.dbConn = new DbConn();
    window.mainPage = new MainPage(document.getElementById("header-div"));    
};