import { select } from 'npm:d3-selection';
import { geoPath, geoMercator, geoTransverseMercator, geoEquirectangular } from 'npm:d3-geo';
import {json, create} from 'npm:d3';
import {feature, mesh} from 'npm:topojson'
import {topology} from 'npm:topojson-server'

export function gentMap(data, topodata){
    console.log("data", data)
    const width = 928;
    const height = 1200;
    const svg = create("svg")
        .attr("width", width)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");
    const path = geoPath()
        .projection(geoTransverseMercator()
            //.rotate([74 + 30 / 60, -38 - 50 / 60])
            .fitExtent([[20, 20], [width - 20, height - 20]], data));


    //let projection = geoTransverseMercator();

    //let path = geoPath()
    //   .projection(projection.rotate([74 + 30 / 60, -38 - 50 / 60]).fitExtent([[20, 20], [width - 20, height - 20]], data));


    svg.selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr("class", "tract")
        .attr("d", path)
        .append("title")
        .text(function(d) { return d.properties.name; });
    console.log("topo", topodata)
    svg.append("path")
        .datum(mesh(topodata, topodata.objects.gent, function(a, b) { return a !== b; }))
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

    console.log("svg",svg.node())

    return svg.node();

}


export function cityNj(nj) { // nj is new jersey json
    console.log("nj", nj)
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
    console.log("land", land)

    // EPSG:32111
    const path = geoPath()
        .projection(geoTransverseMercator()
            .rotate([74 + 30 / 60, -38 - 50 / 60])
            .fitExtent([[20, 20], [width - 20, height - 20]], land));

    /*svg.selectAll("path")
        .data(land.features)
        .enter().append("path")
        .attr("class", "tract")
        .attr("d", path)
        .append("title")
        .text(function(d) { return d.id; });*/

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
    console.log("nj svg",svg.node())
    return svg.node();
}

