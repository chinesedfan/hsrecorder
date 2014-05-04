function showArenaTrend(container, lineTicks, lineData) {
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

    var line = new Venus.SvgChart(container, lineData, lineOptions);
    return line;
}
