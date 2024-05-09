import {Query} from "./queries.js";
import * as d3 from "npm:d3";
import * as Plot from "npm:@observablehq/plot";

/**
 *
 * @param crimeData
 * @param geoData
 * @param crimeCategories - is one element or a list of crimes
 * @param logScale
 * @constructor
 */
export function mapPlot(crimeData, geoData, crimeCategories, logScale, legendDomain){

    let crimes = new Query(crimeData);
    if(Array.isArray(crimeCategories)){
        crimes = crimes.filterByCategories(crimeCategories);
    }
    else if(crimeCategories !== "Alle misdrijven"){
        crimes = crimes.filterByCategory(crimeCategories);
    }
    crimes = crimes.groupByRegion().getTotal().split();
    console.log("crimes", crimes)

    // need to copy the features to avoid changing the original data
    let featuresCopy = JSON.parse(JSON.stringify(geoData.features));
    featuresCopy.forEach((g) => {
        // add crimes 
        const index = crimes.keys.indexOf(g.properties.name);
        g.properties.crimes = crimes.values[index];
    })
    const mapScope = d3.geoCircle().center([3.73, 51.085]).radius(0.11).precision(2)()
    const getMapPlot = (width) => Plot.plot({
        width: width,
        projection: {
            type: "mercator",
            domain: mapScope,
        },
        color: {
            type: logScale ? "log" : "linear",
            domain : legendDomain,
            n:4,
            scheme: "blues",
            label: "Misdrijven per wijk",
            legend: true
        },
        marks: [
            Plot.geo(featuresCopy, { fill: (d) => d.properties.crimes}), // fill
            Plot.geo(featuresCopy), // edges
            Plot.tip(featuresCopy, Plot.pointer(Plot.geoCentroid({title: (d) => `${d.properties.name}: ${d.properties.crimes}`})))
        ]
    })
    return getMapPlot;

}