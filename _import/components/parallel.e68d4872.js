import {Query, getMonths } from "./queries.b1d4624b.js";
import * as d3 from "../../_npm/d3@7.9.0/+esm.js";
import * as Plot from "../../_npm/@observablehq/plot@0.6.14/+esm.js";

export function parallel(crimeData, year, category) {

  /////////////////////
  // Data processing //
  /////////////////////
  
  // select year and category
  const filteredData = new Query(crimeData)
    .filterByYear(Number(year))
    .filterByCategory(category)
    .groupByMonth()
    .result();


  // sort by crime rate and region name. filter region name
  const sortListAndGetRegion = list => {
    return list.sort((a, b) => {
      if (a.total === b.total) {
        return a.region.localeCompare(b.region);
      }
      return a.total - b.total;
    }).map(obj => obj.region);
  };

  const sortedData = {}
  Object.entries(filteredData).forEach(([month, list]) => {
      sortedData[month] = sortListAndGetRegion(list)
  })

  const months = getMonths();
  function getMonthIdx(monthName) {
      const idx = months.indexOf(monthName);
      if (idx !== -1) {
          return (idx + 1).toString().padStart(2, '0');
      } else {
          return null; // Month not found
      }
  }

  // get date, retion and ranking
  const plotData = []
  Object.entries(sortedData).forEach(([month, regions]) => {
      regions.forEach((name, idx) => {
          const dateString = `${year}-${getMonthIdx(month)}-01`;
          const [y, m, d] = dateString.split('-').map(Number);
          const dateDate = new Date(y, m - 1, d);
          plotData.push({
              Datum: dateDate,
              Regio: name,
              Ranking: idx + 1
          });
      });
  })

  //////////
  // Plot //
  //////////
  
  // use observable plot to plot
  const plot = Plot.plot({
      color: {legend: true, columns: 4},
      marks: [
          Plot.ruleY([0]),
          Plot.lineY(plotData, {x: "Datum", y: "Ranking", stroke: "Regio", marker: true, tip: true}),
      ],
  })

  // use d3 to highlight lines on hover
  // https://stackoverflow.com/questions/74454315/how-to-highlight-a-line-when-mouse-over-it-in-observable-plot-using-javascript
    
  // highlight on hover
  d3.select(plot)
    .selectAll("path")
    .on("pointerenter", function() {
      d3.select(plot).selectAll("path").attr("opacity", 0.2);
      d3.select(this).attr("opacity", 1);
    });


  // Reset the appearance when the pointer leaves the SVG
  d3.select(plot).on("pointerleave", function() {
    d3.select(plot).selectAll("path").attr("opacity", 1);
  });

  // Attach the plot to the container DIV
  d3.select('#chart').append(() => plot)

  return plot
}
