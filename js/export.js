/* class ExportPage begin */
function ExportPage() {    
    PageBase.apply(this, arguments);
}

ExportPage.prototype = {
    _initMember: function() {
        this._dbConn = new DbConn()
        this.container.innerHTML = HtmlTemplate.getTemplate("export");

        this.btnExport = $("#btn-export");
        this.btnImport = $("#btn-import");
        this.exportBottom = $("#export-bottom");
        this.exportControl = $("#export-control");

        this.exportContainer = $("#export-container");
        this.exportContent = $("#export-content");
    },
    _initView: function() {
        this.exportBottom.css("top", this.container.offsetTop);

        this.exportControl.css({
            width: "50%",
            height: this.btnExport.outerHeight(),
            margin: "20px auto"
        });
        this.exportContainer.css({
            width: "50%",
            height: "80%",
            margin: "0 auto"
        });
        this.exportContent.css({
            width: "100%",
            height: "100%"
        });        
    },
    _initData: function() {
        // do nothing
    },
    _initEventHandler: function() {
        var page = this;
        this.btnExport.click(function() {
            page.exportContent.val(page.getPayload());   
        });
        this.btnImport.click(function() {
            console.log("import");
            //window.dbConn.execSqlScript(page.exportContent.val());
        });
    },

    sqlTemplate: {
        dropAllTables: 'DROP TABLE __WebKitDatabaseInfoTable__;\nDROP TABLE arena;\nDROP TABLE packs;\nDROP TABLE lacks;\n',
        createDbInfo: 'CREATE TABLE __WebKitDatabaseInfoTable__ (key TEXT NOT NULL ON CONFLICT FAIL UNIQUE ON CONFLICT REPLACE,value TEXT NOT NULL ON CONFLICT FAIL);\nINSERT INTO "__WebKitDatabaseInfoTable__" ( "key",value ) VALUES ( \'WebKitDatabaseVersionKey\',\'1.0\' );\n',
        createArena: 'CREATE TABLE arena(id integer PRIMARY KEY UNIQUE,day date,class varchar,wins integer);\n',
        createLacks: 'CREATE TABLE lacks(id integer PRIMARY KEY AUTOINCREMENT UNIQUE,card_id integer,card_name text,card_quality integer);\n',
        createPacks: 'CREATE TABLE packs(id integer PRIMARY KEY UNIQUE,day date,count_gl integer,count_ge integer,count_gr integer,count_gc integer,count_l integer,count_e integer,count_r integer,count_c integer,tip_gl text,tip_ge text,tip_gr text,tip_gc text,tip_l text,tip_e text,tip_r text,tip_c text,dust integer);\n',
        insertArena: 'INSERT INTO arena ( id,day,class,wins ) VALUES ( ',
        insertLacks: 'INSERT INTO lacks ( id,"card_id","card_name","card_quality" ) VALUES ( ',
        insertPacks: 'INSERT INTO packs ( id,day,"count_gl","count_ge","count_gr","count_gc","count_l","count_e","count_r","count_c","tip_gl","tip_ge","tip_gr","tip_gc","tip_l","tip_e","tip_r","tip_c",dust ) VALUES ( ',
        insertEnd: ' );\n',
    },
    getPayload: function() {
        var mainPage = window.mainPage; // exported in index.js
        mainPage.initAllSubPages();

        var payload = this.sqlTemplate.dropAllTables + this.sqlTemplate.createDbInfo
                + this.sqlTemplate.createArena + this.sqlTemplate.createPacks + this.sqlTemplate.createLacks;
        return payload;
    }
}
/* class ExportPage end */
