import { select } from 'npm:d3-selection';
import { geoPath, geoIdentity} from 'npm:d3-geo';
import { create} from 'npm:d3';


/**
 * Renders an SVG of Ghent
 * @param data the GeoJSON of the map to be rendered
 * @returns SVG of the map
 */
export function cityMap(data){
    const width = 928;
    const height = 1200;
    const svg = create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");
    const path = geoPath()
        .projection(geoIdentity().reflectY(true)
            .fitExtent([[20, 20], [width - 20, height - 20]], data));

    const tooltip = select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr("class", "tract")
        .attr("d", path)
        .attr('fill', 'none')
        .attr('stroke', '#777') // the border color
        .on('mouseover', function(d,i) {
            // todo: Here define plot outside the map
            console.log('Hovered in:', i.properties.name)
        })
        .on('mouseout', function(d,i) {
            // todo here unselect plot
            console.log('Hovered out:', i.properties.name)
        })
        .on('click', function(d, i) {
            // d is the click event info
            // i is the svg that was clicked on
            // todo Here keep the plot slected when clicked on
            console.log('Clicked region:', i.properties.name);
        })
        .append("title")
        .text(function(d) { return d.properties.name; });

    svg.append("style").text(`
    .tract {fill: #eee; cursor: pointer;}
    .tract:hover {fill: orange;}
  `);

    return svg.node();

}


