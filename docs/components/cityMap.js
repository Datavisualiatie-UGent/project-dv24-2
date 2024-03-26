import { select } from 'npm:d3-selection';
import { geoPath, geoMercator, geoTransverseMercator } from 'npm:d3-geo';
import {json, create} from 'npm:d3';
import {feature, mesh} from 'npm:topojson'


export function getCitySVG(data){
    const width = 900;
    const height = 500;

    const svg = select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const projection = geoMercator()

    const path = geoPath().projection(projection);
    json(data, function(err, geojson) {

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
    return svg.node()
}

export function city(nj) {
    const width = 928;
    const height = 1200;
    const svg = create("svg")
        .attr("width", width)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    const land = feature(nj, {
        type: "GeometryCollection",
        geometries: nj.objects.tracts.geometries.filter((d) => (d.id / 10000 | 0) % 100 !== 99)
    });

    // EPSG:32111
    const path = geoPath()
        .projection(geoTransverseMercator()
            .rotate([74 + 30 / 60, -38 - 50 / 60])
            .fitExtent([[20, 20], [width - 20, height - 20]], land));

    svg.selectAll("path")
        .data(land.features)
        .enter().append("path")
        .attr("class", "tract")
        .attr("d", path)
        .append("title")
        .text(function(d) { return d.id; });

    svg.append("path")
        .datum(mesh(nj, nj.objects.tracts, function(a, b) { return a !== b; }))
        .attr("class", "tract-border")
        .attr("d", path);

    svg.append("style").text(`
    .tract {fill: #eee;}
    .tract:hover {fill: orange;}
    .tract-border {
      fill: none;
      stroke: #777;
      pointer-events: none;
    }
  `);

    return svg.node();
}

