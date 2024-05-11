import * as Plot from "../../_npm/@observablehq/plot@0.6.14/+esm.js";

export function barChart(data, x,  y, x_label, y_label, months) {
    let isMonthPlot = months.length != 0;

    if(isMonthPlot){
        data.map((v, i) => v.maand = `${('0'+(i+1)).slice(-2)}  ${v.maand}`);

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
