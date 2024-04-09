/**
 * Create the geojson from the Gent API
 * @param data the gent api data
 * @returns GeoJSON data
 */
export function createGeoData(data){
    let result = {
        "type": "FeatureCollection",
        "features": []
    }
    for (const [key, value] of Object.entries(data)) {
        if(key !== "Onbekend") {
            result.features.push({"type": "Feature","properties": {"name": key}, geometry: value.geometry.geometry})
        }
    }
    return result
}