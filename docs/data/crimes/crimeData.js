import {FileAttachment} from "npm:@observablehq/stdlib";

/**
 * Create the crime data object from the Ghent API raw data.
 * @param rawData The Ghent API data as provided by fetchRawData
 * @returns Crime data
 */
export function createCrimeData(rawData){
  let organised_data = {};

  rawData.forEach(item =>{
    let quarter = item.quarter;
    // store geometry and init categories
    if(!(quarter in organised_data)){
      organised_data[quarter] = {};
    }

    let category = item.fact_category;
    if(!(category in organised_data[quarter])){
      organised_data[quarter][category] = [];
    }

    // store the data
    organised_data[quarter][category].push({
      year: item.year,
      month: item.month,
      total: item.total,
      geo_point_2d: item.geo_point_2d
    });
  });

  return organised_data;
}

/**
 * Load crime data from file.
 * @returns Crime data
 */
export function loadCrimeData(){
  return FileAttachment("crime_data.json").json();
}
