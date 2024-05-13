import * as Plot from "npm:@observablehq/plot";

export function barChart(data, x,  y, x_label, y_label, sort=true) {
    return Plot.plot({
        marginBottom: 100,
        marginLeft: 70,
        tip: true,
        x: {label: x_label, tickRotate: -20},
        y: {label: y_label, grid:true},
        marks: [
            Plot.barY(data, {x: x, y: y, sort: !sort ? null : {x: "-y"}}),
            Plot.tip(data, Plot.pointer({x: x, y: y}))
        ]
    });
}
