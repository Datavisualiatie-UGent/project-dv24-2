import { select } from 'npm:d3-selection';
import { geoPath, geoMercator } from 'npm:d3-geo';
import {json} from 'npm:d3';

export function getCitySVG(){
    const width = 900;
    const height = 500;

    const svg = select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const projection = geoMercator()

    const path = geoPath().projection(projection);
    json("../data/geo.json", function(err, geojson) {

        projection.fitSize([width,height],geojson);

        svg.append("path").attr("d", path(geojson));

    })

// Draw map
    /*svg.selectAll('path')
        .data(cityData.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('stroke', 'black')
        .style('fill', 'lightblue');*/
    return svg
}

