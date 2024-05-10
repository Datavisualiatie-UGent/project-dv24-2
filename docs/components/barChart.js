import * as Plot from "npm:@observablehq/plot";

export function barChart(data, x,  y, x_label, y_label, months) {
    let isMonthPlot = months.length != 0;

    if(isMonthPlot){
        data.map((v, i) => v.month = `${('0'+(i+1)).slice(-2)}  ${v.month}`);

    }
    console.log(data);

    return Plot.plot({
        marginBottom: 100,
        marginLeft: 70,
        tip: true,
        x: {label: x_label, tickRotate: -20},
        y: {label: y_label, grid:true},
        marks: [
            Plot.barY(data, {x: x, y: y, sort: isMonthPlot ? null : {x: "-y"}}),
            Plot.tip(data, Plot.pointer({x: x, y: y}))
        ]
    });
}
