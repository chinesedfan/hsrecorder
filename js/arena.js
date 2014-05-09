window.classMap = {
    Druid: 0, Hunter: 1, Mage: 2,
    Paladin: 3, Priest: 4, Rogue: 5,
    Shaman: 6, Warlock: 7, Warrior: 8,
};
window.classNames = [];
for (var key in classMap) {
    window.classNames.push(key);
}

var classNames = window.classNames;

function showArenaTrend(container, lineTicks, winData) {
    var lineOptions = {
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

function showClassWins(container, winData) {
    var barTicks = classNames;
    var barOptions = {
        axis: {
            x: {
                total: 9,
                tickWidth: 60,
                ticks: barTicks,
                labelRotate: 30,
            },
            y: {
                min: 0,
                max: 11,
                total: 11,
                tickSize: 2,
                tickWidth: 16,
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
        height: 200,
        pie: {
            radius: 60, 
        },
    };
    var pieData = [];
    for (var i = 0; i < classNames.length; i++) {
        pieData.push({name: classNames[i], data: playData[i]});
    }
    pieData.sort(function(a, b) {
        return b.data - a.data;
    });
    var pie = new Venus.SvgChart(container, pieData, pieOptions);
    return pie;
}
