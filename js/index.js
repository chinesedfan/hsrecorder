/* class PageBase begin */
function PageBase() {
    // add fields of this class
    this._initMember();
    // load datas for the database
    this._initData();
    // initialize HTML elements
    this._initView();
    // register event handers
    this._initEventHandler();
}
/* class PageBase end */

/* class MainPage begin */
function MainPage() {    
    PageBase.apply(this);
}

MainPage.prototype = {
    _initMember: function() {
        this._dbConn = new DbConn();
        this._frameIds = ["arena-frame", "packs-frame"];        

        this.arenaNavDomEle = document.getElementById("arena-nav");
        this.packsNavDomEle = document.getElementById("packs-nav");
    },
    _initData: function() {
        this._dbConn.initDB();
    },
    _initView: function() {
        this.showFrame("arena-frame");
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
    new MainPage();
    new ArenaPage();
    new PacksPage();
};