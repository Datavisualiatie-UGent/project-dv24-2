import {FileAttachment} from "../../../_observablehq/stdlib.js";

/**
 * Create the crime data object from the Ghent API raw data.
 * @param rawData The Ghent API data as provided by fetchRawData
 * @returns Crime data
 */
export function createCrimeData(rawData){
  let filtered_data = [];

  rawData.forEach(item =>{
    // store filtered data
    filtered_data.push({
      year: item.year,
      month: item.month,
      category: item.fact_category,
      region: item.quarter,
      total: item.total,
      geo_point_2d: item.geo_point_2d
    });
  });

  return filtered_data;
}

/**
 * Load crime data from file.
 * @returns Crime data
 */
export function loadCrimeData(){
  return FileAttachment("../../../data/crimes/crime_data.json", import.meta.url).json();
}
