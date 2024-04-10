/* Takes the raw data, returns geometry per region */
function getGeometry(rawData) {
  let data = {};
  rawData.forEach(item =>{
    let quarter = item.quarter;
    if(!(quarter in data)){
      data[quarter] = {
        geometry: item.geometry,
      };
    }
  });
  return data;
}

/**
 * Create the geojson from the Ghent API raw data.
 * @param rawData The Ghent API data as provided by fetchRawData
 * @returns GeoJSON data
 */
export function createGeometryData(rawData){
    let data = getGeometry(rawData);
    let result = {
        "type": "FeatureCollection",
        "features": []
    }
    for (const [key, value] of Object.entries(data)) {
        if(key !== "Onbekend") {
            result.features.push({"type": "Feature","properties": {"name": key}, geometry: value.geometry.geometry})
        }
    }
    return result;
}
