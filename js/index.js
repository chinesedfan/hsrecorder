$(window).load(function() {
	var lis = $(".nav li"),
		subpages = $("body > div");

	window.dbConn = new DbConn();
	bindNavEvents();
	showSubpage(0);

	function bindNavEvents() {
		lis.map(function(i, ele) {
			ele.onclick = function() {
				showSubpage(i);
			}
		});
	}

	function showSubpage(index) {
		var sp = $(subpages[index]), func,
			li = $(lis[index]);

		// hide all at first
		subpages.map(function(i, ele) {
			$(ele).hide();
		});
		lis.map(function(i, ele) {
			$(ele).removeClass("active");
		})

		// init if need
		if (!sp.html()) {
			func = sp.attr("page-constructor");
			eval("new " + func + "(sp)");
		}

		// show the selected one and update nav
		sp.show();
		li.addClass("active");
	}
});
