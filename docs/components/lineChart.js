import * as Plot from "npm:@observablehq/plot";

export function lineChart(data, x,  y, width=undefined, rule= [], ruletips=[]) {
    const domain = [new Date(data[0][x]), new Date(data[data.length-1][x])];
    return Plot.plot({
        width:width,
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
