function makePlotly( x, y ){
    var plotDiv = document.getElementById("string");
    var traces = [{
        x: x,
        y: y
    }];

    var layout = {
        yaxis: {fixedrange: true},
        xaxis : {fixedrange: true}
    };

    Plotly.newPlot("string", traces, layout, {displayModeBar: false});
};

makePlotly([0, 1], [0, 0]);