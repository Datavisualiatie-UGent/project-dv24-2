import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function lineChart(data, x,  y) {
    const domain = [new Date(data[0][x]), new Date(data[data.length-1][x])];
    return Plot.plot({
        marks: [
            Plot.ruleY([0]),
            Plot.lineY(data, {x:x, y:y, marker:true})
        ],
        x: {domain: domain, grid:true},
    });
}