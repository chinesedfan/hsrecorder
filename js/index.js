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
    PageBase.apply(this);
}

MainPage.prototype = {
    _initView: function() {
        // because this page is not reusable, all elements are defined in HTML directly

        this._frameIds = ["arena-frame", "packs-frame"];
        this.showFrame("arena-frame");
    },
    _initMember: function() {
        this._dbConn = new DbConn();

        this.arenaNavDomEle = document.getElementById("arena-nav");
        this.packsNavDomEle = document.getElementById("packs-nav");
    },
    _initData: function() {
        this._dbConn.initDB();
    },
    _initEventHandler: function() {
        var page = this;
        this.arenaNavDomEle.onclick = function() {
            page.showFrame("arena-frame");
        }
        this.packsNavDomEle.onclick = function() {
            page.showFrame("packs-frame");
        }
    },

    showFrame: function(frameid) {
        this._frameIds.map(function(fid) {
            var domEle = document.getElementById(fid);
            domEle.style.display = (fid == frameid) ? "block" : "none";
        });
    },
}
/* class MainPage end */

window.onload = function() {
    new MainPage(document.getElementById("header-div"));
    new ArenaPage(document.getElementById("arena-frame"));
    new PacksPage(document.getElementById("packs-frame"));
};