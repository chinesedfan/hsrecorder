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
            var mainPage = window.mainPage; // exported in index.js
            mainPage.initAllSubPages();
            window.setTimeout(function() {
                page.showExportedSqls.apply(page);
            }, 1000);
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
    showExportedSqls: function() {
        var page = this,
            sqls = this.sqlTemplate.dropAllTables + this.sqlTemplate.createDbInfo;
        
        var arenaData = mainPage.pagesArr[0].arenaData,
            packsData = mainPage.pagesArr[1].packsData,
            lacksData = mainPage.pagesArr[2].lacksData,
            x2str = function(x, isLast) {
                return (x !== '' ? '\'' + x + '\'' : 'NULL') + (isLast ? '' : ',');
            },
            arr2str = function(arr, isLast) {
                var str = '';
                for (var i = 0; i < arr.length; i++) {
                    str += x2str(arr[i], i==arr.length-1);
                }
                if (!isLast) str += ','
                return str;
            },
            obj2str = function(obj, last, masks) {
                var str = '', isLast, func;
                for (var p in obj) {
                    if (masks && masks.indexOf(p) >= 0) continue;

                    isLast = (p == last);
                    func = (obj[p] instanceof Array ? arr2str : x2str);
                    str += func(obj[p], isLast);
                }
                return str;
            };
        sqls += this.sqlTemplate.createArena;
        arenaData.rows.map(function(row) {
            sqls += page.sqlTemplate.insertArena + obj2str(row, 'wins') + page.sqlTemplate.insertEnd;
        });
        sqls += this.sqlTemplate.createLacks;
        lacksData.rows.map(function(row, i) {
            sqls += page.sqlTemplate.insertLacks + obj2str(row, 'quality', ['color']) + page.sqlTemplate.insertEnd;
        });
        sqls += this.sqlTemplate.createPacks;
        packsData.rows.map(function(row, i) {
            sqls += page.sqlTemplate.insertPacks + obj2str(row, 'dust') + page.sqlTemplate.insertEnd;
        });

        page.exportContent.val(sqls);
    }
}
/* class ExportPage end */
