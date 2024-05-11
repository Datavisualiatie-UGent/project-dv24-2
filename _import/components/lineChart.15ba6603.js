import * as Plot from "../../_npm/@observablehq/plot@0.6.14/+esm.js";

export function lineChart(data, x,  y, rule= [], ruletips=[]) {
    const domain = [new Date(data[0][x]), new Date(data[data.length-1][x])];
    return Plot.plot({
        marks: [
            Plot.ruleY([0]),
            Plot.ruleX(rule, {stroke: "red"}),
            Plot.lineY(data, {x:x, y:y, marker:true}),
            Plot.tip(data, Plot.pointer({x: x, y: y})),
            Plot.tip(ruletips, Plot.pointerX({x: rule})),
        ],
        x: {domain: domain, grid:true},
    });
}