import * as d3 from "npm:d3";
import * as Plot from "npm:@observablehq/plot";

/**
 *
 * @param crimes: The crimes for each region. formatted as arrays, 1 with the region names, and 1 with the values. {keys: [...], values: [...]} 
 * @param geoData: The geoData
 * @param logScale: whether or not to use logScale
 * @constructor
 */
export function mapPlot(crimes, geoData, logScale, domain){
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
            type: logScale ? "symlog" : "linear",
            domain: domain,
            scheme: "blues",
            label: "Misdrijven per wijk",
            legend: true,
            width:width,
            ticks: 4,
            tickFormat: tickFormatter,
        },
        marks: [
            Plot.geo(featuresCopy, { fill: (d) => d.properties.crimes}), // fill
            Plot.geo(featuresCopy), // edges
            Plot.tip(featuresCopy, Plot.pointer(Plot.geoCentroid({title: (d) => `${d.properties.name}: ${d.properties.crimes}`})))
        ]
    })
    return getMapPlot;
}

const tickFormatter = (value) => {
  if(value < 1000){
    return value
  }
  return `${value/1000}k`
}

function getLegendDomain(crimes){
  return [Math.min(...crimes.values), Math.max(...crimes.values)];
}

export function getDomainFromRange(crimes, dates, length){
  let n = dates.length;
  let minVal = Infinity;
  let maxVal = -Infinity;
  // iterate all possible sliced for this length
  // get min and max
  for(let i = 0; i + length <= n; i++){
    const datesSlice = dates.slice(i, i + length);
    let slicedCrimes = crimes.selectMultiple(datesSlice).aggregate().groupByRegion().getTotal().split();

    let slicedMin = Math.min(...slicedCrimes.values);
    let slicedMax = Math.max(...slicedCrimes.values);
    minVal = Math.min(minVal, slicedMin);
    maxVal = Math.max(maxVal, slicedMax);
  }

  return [minVal, maxVal];
}
