---
toc: false
theme: air
---
# Criminaliteitscijfers Gent
Brent Matthys, Warre Provoost en Mats Van Belle
***

Voor het vak Datavisualisatie aan UGent, gegeven door Bart Mesuere moesten we als project een dataset visualiseren. Deze pagina is het resultaat van dat project. We hebben gekozen om de [dataset van Criminaliteitscijfers in Gent](https://data.stad.gent/explore/?disjunctive.keyword&disjunctive.theme&sort=explore.popularity_score&refine.keyword=Criminaliteitscijfers) te visualiseren.

Voor de visualisaties maken we voornamelijk gebruik van [observable plot](https://observablehq.com/plot/) en waar nodig vullen we dit aan met [d3](https://d3js.org/).

```js
// imports 

// data
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {loadGeometryData} from "./data/geometry/geometryData.js";

// components
import {cityNj, cityMap} from "./components/cityMap.js"
import {lineChart} from "./components/lineChart.js"
import {barChart} from "./components/barChart.js"
import {parallel} from "./components/parallel.js"
import {Query, getMonths, getYears, getCategories, getRegions} from "./components/queries.js";

// misc
import * as echarts from "npm:echarts";
import {svg} from "npm:htl";
import * as d3 from "npm:d3";
```

```js
// load data
const crimeData = await loadCrimeData();
const geoData = await loadGeometryData();
geoData.features.forEach((g) => {
    // coordinates are inside out, so reverse them
    g.geometry.coordinates[0] = g.geometry.coordinates[0].reverse()
})

// basic data
const months = getMonths();
const years = getYears();
const categories = getCategories();
const regions = getRegions();
const categoryDefault = "Alle misdrijven"
const regionDefault = "Alle regio's"
const categoryCats = [categoryDefault].concat(categories)
const regionCats = [regionDefault].concat(regions)
```

## De dataset

```js
const parkInput_dataset = Inputs.toggle({label: "Toon parkeer overtredingen"})
const showPark_dataset = Generators.input(parkInput_dataset);

let categoricalCrimes = new Query(crimeData).groupByCategory().getTotal().aggregate("category").result();
let regionCrimes = new Query(crimeData).groupByRegion().getTotal().aggregate("region").result();
let yearCrimes = new Query(crimeData).groupByYear().getTotal().aggregate("year").result();
let monthCrimes = new Query(crimeData).groupByMonth().getTotal().aggregate("month").result();
```

```js
const getCategoryPlot = barChart(categoricalCrimes, "category", "total", "Category", "Amount of crimes");
const getRegionPlot = barChart(regionCrimes, "region", "total", "Region", "Amount of crimes");
const getYearPlot = barChart(yearCrimes, "year", "total", "Year", "Amount of crimes");
const getMonthPlot = barChart(monthCrimes, "month", "total", "Month", "Amount of crimes");
```

```html
<div class="grid grid-cols-3">
  <div class="grid-colspan-1">
        <p>
            Sinds 2018 maakt Stad Gent criminaliteitscijfers beschikbaar. Voor elke maand geeft de dataset het aantal misdrijven in elke wijk voor de gegeven categorieën.
        </p>
        <p>
            In de figuur rechts kan u het aantal misdrijven zien voor elke categorie. Het valt onmiddelijk op dat er heel veel parkeerovertredingen zijn.
        </p>
        <p>
            Bij het maken van visualisaties kan het een vertkend beeld geven wanneer een categorie heel dominant aanwezig is. Voor die reden zullen de visualisaties steeds de mogelijkheid hebben om getoond te worden met en zonder de parkeerovertredingen via een volgende button:
        </p>
        <div>
            <i>Klik me!</i>
            ${parkInput_dataset}
        </div>
  </div>
  <div class="grid-colspan-2">
        <h4>Aantal misdrijven per categorie</h4>
        ${getCategoryPlot}
  </div>
</div>
```

```html
<div class="grid grid-cols-3">
  <div class="grid-colspan-2">
      <h4>Aantal misdrijven per regio</h4>
      ${getRegionPlot}
  </div>
  <div class="grid-colspan-1">
      <p>
          Bekijk zeker ook de 3 andere plots voor een ruimer beeld van de dataset. Het is bijvoorbeeld duidelijk dat, alhoewel de criminaleit redelijk constant blijft doorheen de tijd, we wel een onevenwicht hebben tussen de regio's.
      </p>
      <p>
          Op de figuur links zien we bijvoorbeeld dat het merendeel van de misdrijven in de binnenstad plaatsvindt. Dit kan te maken hebben met het aantal inwoners, een strengere controle of omdat de binnenstad gewoonweg een populaire locatie is. Wat de reden ook kan zijn, het kan belangrijk zijn om deze nuance in je achterhoofd te houden.
      </p>
  </div>
</div>
```

```html
<div class="grid grid-cols-2">
  <div class="grid-colspan-1">
      <h4>Aantal misdrijven per jaar</h4>
      ${getYearPlot}
  </div>
  <div class="grid-colspan-1">
      <h4>Aantal misdrijven per maand</h4>
      ${getMonthPlot}  
  </div>
</div>
```


## Misdrijven per wijk

```js show
const dates = [];
for(let year of years){
    for(let month of months){
        dates.push(year + "-" + month);
    }
}
```

```js
// Map inputs
const dateInput = Inputs.range([0, dates.length - 1], {step: 1, label: " ", value: dates.length - 1});
const dateIdx = Generators.input(dateInput);

const parkInput_mainMap = Inputs.toggle({label: "Toon parkeer overtredingen"});
const showPark_mainMap = Generators.input(parkInput_mainMap);

const cumulativeInput = Inputs.toggle({label: "Cummulatieve heatmap", value: true});
const showCumulative = Generators.input(cumulativeInput);

const scaleInput = Inputs.toggle({label: "Gebruik logaritmische schaal", value: true});
const logScale = Generators.input(scaleInput);

const mapCategoryInput = Inputs.select(categoryCats, {value: "Alle misdrijven", label: "Selecteer misdrijf"});
const mapCategoryValue = Generators.input(mapCategoryInput);
```

```js
const split = dates[dateIdx].split("-");
const selectedYear = parseInt(split[0]);
const selectedMonth = split[1];
const dateStr = selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1) + " " + selectedYear;
```

```js
d3.select(dateInput)
    .selectAll("input[type='number']")
    .remove(); // use d3 to remove number box
d3.select(dateInput)
    .selectAll("label")
    .html(dateStr); // Replace label with value
```

```js
// The map
let crimes = new Query(crimeData);
if(mapCategoryValue !== categoryDefault){
    crimes = crimes.filterByCategory(mapCategoryValue);
}
if(!showPark_mainMap){
    // TODO remove parkin crime data
    
}
if(showCumulative){
    // TODO remove all dates after given date
}else {
    // TODO remove all dates except given date
}
crimes = crimes.groupByRegion().getTotal().split();
geoData.features.forEach((g) => {
    // add crimes 
    const index = crimes.keys.indexOf(g.properties.name);
    g.properties.crimes = crimes.values[index];
})
const mapScope = d3.geoCircle().center([3.73, 51.085]).radius(0.11).precision(2)()
const getMapPlot = (width) => Plot.plot({
    width: width,
    projection: {
        type: "mercator",
        domain: mapScope,
    },
    color: {
        type: logScale ? "log" : "linear",
        n:4,
        scheme: "blues",
        label: "Misdrijven per wijk",
        legend: true
    },
    marks: [
        Plot.geo(geoData.features, { fill: (d) => d.properties.crimes}), // fill
        Plot.geo(geoData.features), // edges
        Plot.tip(geoData.features, Plot.pointer(Plot.geoCentroid({title: (d) => `${d.properties.name}: ${d.properties.crimes}`})))
    ]
})
```

```html
<div class="grid grid-cols-3">

    <div class="grid-colspan-2 grid-rowspan-2">
        ${resize((width) => getMapPlot(width))}
    </div>
    <div class="grid-colspan-1">
        <p>
            Groot Gent bestaat uit 25 wijken, zoals te zien is op de kaart links.
        </p>
        <p>
            Deze heatmap maakt duidelijk in welke wijken criminaliteit het hoogst ligt. Zelfs wanneer we de parkeerovertredingen niet in rekening brengen zien we dat
            criminaliteit het hoogst ligt in het centrum van de stad. Voor deze reden voegen we de optie toe om een logaritmische schaal te gebruiken.
        </p>
        <p>
            We kunnen de slider gebruiken om de misdrijven te visualiseren doorheen de tijd. Dit zowel cummulatief, of exact voor een gegeven maand.    
        </p>
    </div>
    <div>
        ${parkInput_mainMap}
        ${scaleInput}
        ${cumulativeInput}
        ${dateInput}
        ${mapCategoryInput}
    </div>
</div>
```


## Criminaliteit doorheen de tijd

```js
// Inputs
const lineChartCategoryInput = Inputs.select(categoryCats, {value: "Alle misdrijven", label: "Selecteer misdrijf"});
const lineChartCategoryValue = Generators.input(lineChartCategoryInput);
const lineChartRegionInput = Inputs.select(regionCats, {value: "Alle regio's", label: "Selecteer regio"});
const lineChartRegionValue = Generators.input(lineChartRegionInput);
```

```js
// Plots
let category = lineChartCategoryValue;
if(category === categoryDefault) {
    category = null;
}
let region = lineChartRegionValue;
if(region === regionDefault) {
    region = null;
}

function convert_to_date_string(year, month){
    let index = (months.indexOf(month) + 1).toString();
    if (index.length < 2) {
        index = `0${index}`;
    }
    return `${year}-${index}-01`;
};

// Category
let resultPerMonthCategoryQuery = new Query(crimeData).filterByCategory(category).groupByYear();
if (category === "Verkeersongevallen met lichamelijk letsel") {
    resultPerMonthCategoryQuery = resultPerMonthCategoryQuery.deleteMultiple(["2018", "2019"]);
}
const resultPerMonthCategory = resultPerMonthCategoryQuery.groupByMonth()
                                                          .aggregate("n.a.", convert_to_date_string)
                                                          .deleteMultiple(["2023-09-01", "2023-10-01", "2023-11-01", "2023-12-01"])
                                                          .getTotal()
                                                          .aggregate("date")
                                                          .result();

const getCategoryLineChart = lineChart(resultPerMonthCategory, "date", "total");

// Region
const resultPerMonthRegion = new Query(crimeData).filterByRegion(region)
                                                 .groupByYear()
                                                 .groupByMonth()
                                                 .aggregate("n.a.", convert_to_date_string)
                                                 .deleteMultiple(["2023-09-01", "2023-10-01", "2023-11-01", "2023-12-01"])
                                                 .getTotal()
                                                 .aggregate("date")
                                                 .result();

const getRegionLineChart = lineChart(resultPerMonthRegion, "date", "total");
```

```html
<div class="grid grid-cols-3">
  <div class="grid-colspan-1">
    <p>
        Zoals we eerder al opmerkten bestaat de dataset uit talrijke categoriëen. Even interessant buiten bekijken welk soort criminaliteit het meest optreedt is bekijken wanneer deze het meest optreedt.
    </p>
    <p>
        In deze interactieve linechart kan je bekijken in welke periode een bepaald soort criminaliteit het meest prevalent is. Sommige van deze periodes zijn te verklaren via externe factoren, waar we ook later op zullen ingaan. Het kan echter al zeer interessant zijn om zelf eens met de data te spelen en misschien ontdek je zelf enkele verbanden.
    </p>
  </div>
  <div class="grid-colspan-2">
      <div>
          <h4>Trend in het aantal misdrijven voor categorie: ${lineChartCategoryInput}</h4>
          ${getCategoryLineChart}
      </div>
      <div>
          <h4>Trend in het aantal misdrijven in de regio: ${lineChartRegionInput}</h4>
          ${getRegionLineChart}
      </div>
  </div>
</div>
```

## De ernst van misdrijven
TODO
## Gentse feesten
TODO
## Covid
TODO
