import { select } from 'npm:d3-selection';
import { geoPath, geoIdentity, geoAzimuthalEquidistant, geoAzimuthalEqualArea} from 'npm:d3-geo';
import  {range, pointer, create, scaleLinear,extent, scaleQuantile, axisBottom, format, scaleThreshold} from 'npm:d3';
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
    select("#map_div")
    .attr("width", width)
    .attr("height", height)
    const svg =  create("svg")
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
    const colors = ["#ffffcc",
    "#ffeda0", "#fed976", "#feb24c", "#fd8d3c",
    "#fc4e2a", "#e31a1c", "#bd0026", "#800026"]
    const customRound = (x) =>{
        if (x < 100) {
            // Round to the nearest ten for small numbers
            return Math.floor(x / 10) * 10;
        } else{
            // Round to the nearest hundred for larger numbers  
            return Math.floor(x / 100) * 100;
        }
        // can be extended for larger values...
    }

    const query = new Query(crimeData)
    // total crimes regarded, categories and time should be defined outside
    const total = query.getTotal().data
    const regions = query.groupByRegion().data
    // get a list of all the values to determine the scale
    const extent_list = []
    for (const key in regions){
        extent_list.push(customRound(new Query(regions[key]).getTotal().data))
    }
    const quantileScale = scaleQuantile()
    .domain(extent_list)
    .range(colors);
    // Round the quantile thresholds
    const thresholds = quantileScale.range().map((color, i) => {
        return customRound(quantileScale.invertExtent(color)[0]);
    })
    //transform it to a threshold scale for nicer bounds
    const tScale = scaleThreshold(thresholds, colors)
    
    const crimeColor = (name)=>{
        let value = new Query(regions[name]).getTotal().data
        return tScale(value);
    }
    // LEGEND

    // Define the size and position of the legend
    const legendWidth = 600;
    const legendHeight = 20;
    const legendX = 50;
    const legendY = height - 50; // position the legend at the bottom of the SVG

    // Create a linear scale for the legend
    const legendScale = scaleLinear()
    .domain(tScale.domain())
    .range([0, legendWidth]);

    // Create the legend group
    const legend = svg.append("g")
    .attr("transform", `translate(${legendX}, ${legendY})`);

    // Create one rectangle for each color in the scale
    tScale.range().forEach((color, i) => {
    legend.append("rect")
        .attr("x", i * (legendWidth / tScale.range().length))
        .attr("width", legendWidth / tScale.range().length)
        .attr("height", legendHeight)
        .attr("fill", color);

        // Add a label for each color
        legend.append("text")
        .attr("x", i * (legendWidth / tScale.range().length))
        .attr("y", legendHeight + 20) // position the label below the rectangle
        .text(i < tScale.domain().length ? tScale.domain()[i] : ""); // use the threshold value as the label
    });

    // Add a legend title
    legend.append("text")
    .attr("x", -10)
    .attr("y", -10)
    .text("Crime Rate");

    // Add an axis to the legend
    const legendAxis = axisBottom(legendScale)
    .tickValues([])
    .tickFormat("");

    legend.append("g")
    .attr("transform", `translate(0, ${legendHeight})`)
    .call(legendAxis);
    
    
        // create a tooltip
    const tooltip = select("#map_div")
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
    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function(d) {
        tooltip
            .style("opacity", 1)
        select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }
    const mousemove = function(d,i) {
        const div = svg.node().getBoundingClientRect();
        const value =  new Query(regions[i.properties.name]).getTotal().data
        tooltip
            .html(`${i.properties.name}: <br> ${value}`)//change this
            .style("left", (d.clientX - div.left -100 ) + "px")
            .style("top", (d.clientY - div.top + 70) + "px")
    }
    const mouseleave = function(d, i) {
        tooltip
            .style("opacity", 0)
        select(this)
            //.attr("fill", crimeColor(i.properties.name))
            .style("stroke", "#777")
            .style("opacity", 0.8)
    }


    svg.selectAll("path")
        .data(geoData.features)
        .enter().append("path")
        .attr("class", "tract")
        .attr("d", path)
        .attr('fill', function (d){
            return crimeColor(d.properties.name)
        })
        .attr('stroke', '#777') // the border color
        .style("opacity", 0.8)
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


    svg.append("style").text(`
    .tract { 
    cursor: pointer;}
    
  `);
    return svg;

}


