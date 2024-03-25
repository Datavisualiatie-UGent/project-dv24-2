import { select } from 'npm:d3-selection';
import { geoPath, geoMercator } from 'npm:d3-geo';

export function getCitySVG(){
    const cityData = require('../data/sectoren-circulatieplan-gent.geojson');


    const svg = select('body')
        .append('svg')
        .attr('width', 800)
        .attr('height', 600);

    const projection = geoMercator()
        .fitSize([800, 600], cityData);

    const path = geoPath().projection(projection);

// Draw map
    svg.selectAll('path')
        .data(cityData.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('stroke', 'black')
        .style('fill', 'lightblue');
    return svg
}

