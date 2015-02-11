$(window).load(function() {
	var lis = $(".nav li"),
		subpages = $("body > div");

	window.dbConn = new DbConn();
	bindNavEvents();
	showSubpage(0);

	function bindNavEvents() {
		lis.map(function(ele, i) {
			ele.onclick = function() {
				showSubpage(i);
			}
		});
	}

	function showSubpage(i) {
		var sp = $(subpages[i]), func,
			li = $(lis[i]);

		// hide all at first
		subpages.map(function(ele) {
			$(ele).hide();
		});
		lis.map(function(ele) {
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
