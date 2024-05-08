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
import {parallel} from "./components/parallel.js"
import {Query, getMonths, getYears, getCategories} from "./components/queries.js";

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
```

## De dataset

```js
const parkInput_dataset = Inputs.toggle({label: "Toon parkeer overtredingen"})
const showPark_dataset = Generators.input(parkInput_dataset);

let categoricalCrimes = new Query(crimeData).groupByCategory().getTotal().split();
const cats = categoricalCrimes.keys;
const values = categoricalCrimes.values
categoricalCrimes = cats.map((item, idx) => {
    return{
        category: item,
        value: values[idx]
    }
});
```

```js
const getCategoryPlot = (width) => Plot.plot({
    marginBottom: 100,
    marginLeft: 70,
    width: width,
    tip: true,
    x: {label: "Categorie", tickRotate: -20},
    y: {label: "Aantal misdrijven", grid:true},
    marks: [
        Plot.barY(categoricalCrimes, {x: "category", y: "value", sort: {x: "-y"}}),
        Plot.tip(categoricalCrimes, Plot.pointer({x: "category", y: "value"}))
    ]
});
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
            Bij het maken van visualisaties kan het een vertkend beeld geven wanneer een categorie heel dominant aanwezig is. Voor die reden zullen de visualisaties steeds de mogelijkheid hebben om getoond te worden met en zonder de parkeerovertredingen.
        </p>
  </div>
  <div class="grid-colspan-2">
        ${parkInput_dataset}
        ${resize((width) => getCategoryPlot(width))}
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

const mapCrimeCats = ["Alle misdrijven"]
mapCrimeCats.push(...categories)
const categoryInput = Inputs.select(mapCrimeCats, {value: "Alle misdrijven", label: "Selecteer misdrijf"});
const categoryValue = Generators.input(categoryInput);
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
if(categoryValue !== "Alle misdrijven"){
    crimes = crimes.filterByCategory(categoryValue);
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
        ${categoryInput}
    </div>
</div>
```


## Line chart

```js
const category = view(Inputs.select([null].concat(categories), {label: "Selecteer categorie:"}));
```
```js
const resultPerMonth = new Query(crimeData).filterByCategory(category).groupByYear().groupByMonth().aggregate("n.a.", (year, month) => {
    let index = (months.indexOf(month) + 1).toString();
    if (index.length < 2) {
        index = `0${index}`;
    }
    return `${year}-${index}-01`;
}).getTotal().aggregate("date").result();

display(lineChart(resultPerMonth, "date", "total"));
```

## Amount of crimes
We can then take a look at the amount of crimes in each category and in each year.

```js
const amountOfCrimesPerCategoryChart = echarts.init(display(html`<div style="width: 1000px; height:650px;"></div>`));

const queryResult = new Query(crimeData).groupByCategory().deleteMultiple(["Parkeerovertredingen", "Fietsdiefstal"]).getTotal().split();

amountOfCrimesPerCategoryChart.setOption({
  title: {
    text: "Total amount of crimes per category."
  },
  tooltip: {},
  xAxis: {
    type: "category",
    data: queryResult.keys,
    axisLabel: {
      interval: 0,
      rotate: 30
    }
  },
  yAxis: {},
  series: [
    {
      name: "crimes",
      type: "bar",
      data: queryResult.values
    }
  ],
  grid: {containLabel: true}
});
```

```js
const amountOfCrimesPerCategoryChart = echarts.init(display(html`<div style="width: 1000px; height:650px;"></div>`));

const queryResult = new Query(crimeData).groupByRegion().getTotal().split();

amountOfCrimesPerCategoryChart.setOption({
  title: {
    text: "Total amount of crimes per region."
  },
  tooltip: {},
  xAxis: {
    type: "category",
    data: queryResult.keys,
    axisLabel: {
      interval: 0,
      rotate: 30
    }
  },
  yAxis: {},
  series: [
    {
      name: "crimes",
      type: "bar",
      data: queryResult.values
    }
  ],
  grid: {containLabel: true}
});
```

```js
const amountOfCrimesPerCategoryChart = echarts.init(display(html`<div style="width: 1000px; height:650px;"></div>`));

const queryResult = new Query(crimeData).groupByMonth().getTotal().split();

amountOfCrimesPerCategoryChart.setOption({
  title: {
    text: "Total amount of crimes per month."
  },
  tooltip: {},
  xAxis: {
    type: "category",
    data: queryResult.keys,
    axisLabel: {
      interval: 0,
      rotate: 30
    }
  },
  yAxis: {},
  series: [
    {
      name: "crimes",
      type: "bar",
      data: queryResult.values
    }
  ],
  grid: {containLabel: true}
});
```

```js
const amountOfCrimesPerYear = echarts.init(display(html`<div style="width: 1000px; height:650px;"></div>`));

const queryResult = new Query(crimeData).groupByYear().getTotal().split();

amountOfCrimesPerYear.setOption({
  title: {
    text: "Total amount of crimes per year."
  },
  tooltip: {},
  xAxis: {
    type: "category",
    data: queryResult.keys,
    axisLabel: {
      interval: 0
    }
  },
  yAxis: {},
  series: [
    {
      name: "crimes",
      type: "bar",
      data: queryResult.values
    }
  ],
  grid: {containLabel: true}
});
```

## De ernst van misdrijven
TODO
## Gentse feesten
TODO
## Covid
TODO
