function showArenaTrend(container, lineTicks, winData) {
    var lineOptions = {
        width: 900,
        height: 400,
        axis: {
            x: {
                tickWidth: 20,
                ticks: lineTicks,
            },
            y: {
                min: 0,
                max: 11,
                total: 11,
                tickSize: 2,
                tickWidth: 20,
                rotate: 90,
            },
        },
        line: {
            dots: true,
            dotRadius: 6,
        },
        icons: {
            0: "circle",
        },
    };
    var lineData = [{name: 0, data: winData}];
    var line = new Venus.SvgChart(container, lineData, lineOptions);
    return line;
}

var classNames = ["Druid", "Hunter", "Mage", "Paladin", "Priest",
        "Rogue", "Shaman", "Warlock", "Warrior"];

function showClassWins(container, winData) {
    var barTicks = classNames;
    var barOptions = {
        width: 900,
        height: 400,
        axis: {
            x: {
                tickWidth: 75,
                ticks: barTicks,
            },
            y: {
                min: 0,
                max: 11,
                total: 11,
                tickSize: 2,
                tickWidth: 20,
                rotate: 90,
            },
        },
        bar: {
            radius: 0,
        },
    };
    var arr = {};
    for (var i = 0; i < barTicks.length; i++) {
        arr[barTicks[i]] = winData[i];
    }
    var barData = [{name: 0, data: arr}];
    var bar = new Venus.SvgChart(container, barData, barOptions);
    return bar;
}

function showClassRates(container, playData) {
    var pieOptions = {
        width: 900,
        height: 400,
        pie: {
            radius: 100, 
        },
    };
    var pieData = [];
    for (var i = 0; i < classNames.length; i++) {
        pieData.push({name: classNames[i], data: playData[i]});
    }
    var pie = new Venus.SvgChart(container, pieData, pieOptions);
    return pie;
}
