import { select } from 'npm:d3-selection';
import { geoPath, geoIdentity, geoAzimuthalEquidistant, geoAzimuthalEqualArea} from 'npm:d3-geo';
import  {pointer, create, scaleLinear} from 'npm:d3';
import {Query} from "./queries.js";


/**
 * Renders an SVG of Ghent
 * @param geoData the GeoJSON of the map to be rendered
 * @param crimeData the Crime data
 * @returns SVG of the map
 */
export function cityMap(geoData, crimeData){
    // svg data
    const width = 800;
    const height = 800;
    select("#div_template")
    .attr("width", width)
    .attr("height", height)
    const svg =  select("#div_template")
        .append("svg")
        .attr("id", "myMap")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");
    const path = geoPath()
        .projection(
            geoIdentity().reflectY(true)
            .fitExtent([[20, 20], [width , height ]], geoData)
        );
    // heatmap



    const query = new Query(crimeData)
    const myColor = scaleLinear()
        .range(["white", "#69b3a2"])
        .domain([1,100])
    // total crimes regarded, categories and time should be defined outside
    const total = query.getTotal().data
    const crimeColor = (name)=>{
        const t = new Query(query.groupByRegion().data[name]).getTotal().data
        const v = scaleLinear()
            .range(["white", "#69b3a2"])
            .domain([1,total])
        return v(t)
    }

    // create a tooltip
    const tooltip = select("#div_template")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style( "align-content", "center")
        .style( "margin-right", "10%")
        .style("margin-left", "10%")
    console.log(tooltip)
    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function(d) {
        tooltip
            .style("opacity", 1)
        select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }
    const mousemove = function(d,i) {
        const div = select("#div_template").node().getBoundingClientRect();

        console.log(d)
        tooltip
            .html("The exact value of<br>this cell is: ")
            .style("left", (d.clientX - div.left -100 ) + "px")
            .style("top", (d.clientY - div.top + 70) + "px")
    }
    const mouseleave = function(d) {
        tooltip
            .style("opacity", 0)
        select(this)
            .style("stroke", "#777")
            .style("opacity", 0.8)
    }


    svg.selectAll("path")
        .data(geoData.features)
        .enter().append("path")
        .attr("class", "tract")
        .attr("d", path)
        .attr('fill', function (d){
            //d.properties.name
            return crimeColor(d.properties.name)
        })
        .attr('stroke', '#777') // the border color
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on('click', function(d, i) {
            // d is the click event info
            // i is the svg that was clicked on
            // todo Here keep the plot slected when clicked on
            console.log('Clicked region:', i.properties.name);
        })
        .append("title")
        .text(function(d) { return d.properties.name; });


    const bnw = new Query(query.groupByRegion().data["Binnenstad"])
    const y = new Query(bnw.filterByCategory("Diefstal uit of aan voertuigen").groupByYear().data)
    //console.log(y.groupByMonth())


   /* svg.append("style").text(`
    .tract {fill: #eee; 
    cursor: pointer;}
    .tract:hover {fill: orange;}
  `);*/




    //return svg;

}


