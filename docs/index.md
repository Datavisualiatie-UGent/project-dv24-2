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
import {Query, getMonths, getYears, getCategories, getLightCategories, getMediumCategories, getSevereCategories} from "./components/queries.js";
import {mapPlot} from "./components/mapPlot.js"

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
const parkInput_dataset = Inputs.toggle({label: "Toon parkeer overtredingen", value: true})
const showPark_dataset = Generators.input(parkInput_dataset);
```

```js

let categoricalCrimes = new Query(crimeData).groupByCategory();
if(!showPark_dataset){
    categoricalCrimes = categoricalCrimes.delete("Parkeerovertredingen");
}
categoricalCrimes = categoricalCrimes.getTotal().split();
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
let dates = [];
for(let year of years){
    for(let month of months){
        dates.push(year + " - " + month);
    }
}
// last 4 months of 2023 have no data
dates = dates.slice(0, -4)
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
const selectedDate = dates[dateIdx];
```

```js
d3.select(dateInput)
    .selectAll("input[type='number']")
    .remove(); // use d3 to remove number box
d3.select(dateInput)
    .selectAll("label")
    .html(selectedDate); // Replace label with value
```

```js
let mapCrimes = new Query(crimeData);
// The map
if(!showPark_mainMap){
    mapCrimes = mapCrimes.groupByCategory().delete("Parkeerovertredingen").aggregate();
}
if(categoryValue !== "Alle misdrijven"){
    mapCrimes = mapCrimes.filterByCategory(categoryValue);
}
if(showCumulative){
    // console.log(dateIdx + 1)
    // console.log(slice);
    // console.log(mapCrimes);
    // let slice = dates.slice(0, dateIdx + 1)
    // mapCrimes = mapCrimes.selectMultiple(slice);
}else {
    mapCrimes = mapCrimes.groupByYear().groupByMonth().aggregate();
    mapCrimes = mapCrimes.select(selectedDate);
}

mapCrimes = mapCrimes.groupByRegion().getTotal().split();
const getMapPlot = mapPlot(mapCrimes, geoData, logScale, [Math.min(...mapCrimes.values), Math.max(...mapCrimes.values)]);
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
```js
const baseCategories = [getLightCategories(), getMediumCategories(), getSevereCategories()];
const resetBtn = Inputs.button("Reset", {value: baseCategories, reduce: () => (baseCategories)})
const resetCategories = Generators.input(resetBtn)
```

```js
const tableData = categories.map((value) => ({"Misdrijf": value}))

// light
const lightTableInput = Inputs.table(tableData, {rows: tableData.length + 1, value: tableData.filter((o) => resetCategories[0].includes(o.Misdrijf)), required: false});
const lightTableSelection = Generators.input(lightTableInput);

// medium
const mediumTableInput = Inputs.table(tableData, {rows: tableData.length + 1, value: tableData.filter((o) => resetCategories[1].includes(o.Misdrijf)), required: false});
const mediumTableSelection = Generators.input(mediumTableInput);

// severe
const severeTableInput = Inputs.table(tableData, {rows: tableData.length + 1, value: tableData.filter((o) => resetCategories[2].includes(o.Misdrijf)), required: false});
const severeTableSelection = Generators.input(severeTableInput); 
```

```js
const lightCrimes = lightTableSelection.map((o) => (o.Misdrijf))
const mediumCrimes = mediumTableSelection.map((o) => (o.Misdrijf))
const severeCrimes = severeTableSelection.map((o) => (o.Misdrijf))
```

```js
function getCrimeData(crimeData, cats){
    let selectedData = new Query(crimeData).filterByCategories(cats).groupByRegion().getTotal().split();
    if (cats.length == 0){
        // Nothing is selected
        selectedData.values = new Array(selectedData.keys.length).fill(0)
    }
    return selectedData
}
```

```js
// create the domain ranges so that all the maps legends are the same
let minCrimesSeverity = Infinity;
let maxCrimesSeverity = -Infinity;
let selectedCategories = lightCrimes.concat(mediumCrimes).concat(severeCrimes);
let totalCrimes = new Query(crimeData).filterByCategories(selectedCategories).groupByRegion().getTotal().split();
let categoryMin = Math.min(...totalCrimes.values);
let categoryMax = Math.max(...totalCrimes.values);
minCrimesSeverity = Math.min(minCrimesSeverity, categoryMin);
maxCrimesSeverity = Math.max(maxCrimesSeverity, categoryMax);

const domain = [minCrimesSeverity, maxCrimesSeverity]
```

```js
const mapLight = mapPlot(
    getCrimeData(crimeData, lightCrimes),
    geoData,
    true,
    domain
)
```
```js
const mapMedium = mapPlot(
    getCrimeData(crimeData, mediumCrimes),
    geoData,
    true,
    domain
)
```
```js
const mapSevere = mapPlot(
    getCrimeData(crimeData, severeCrimes),
    geoData,
    true,
    domain
)
```

```html
<div class="grid grid-cols-3">
    <div class="grid-colspan-1 grid-rowspan-2">
        <h4>Licht misdrijf</h4>
        ${lightTableInput}
    </div>
    <div class="grid-colspan-1 grid-rowspan-2">
        <h4>Gematigd misdrijf</h4>
        ${mediumTableInput}
    </div>
    <div class="grid-colspan-1 grid-rowspan-2">
        <h4>Ernstig misdrijf</h4>
        ${severeTableInput}
    </div>
</div>
```
```html
<div class="grid grid-cols-3">
    <div class="grid-colspan-1 grid-rowspan-2">
        ${resize((width) => mapLight(width))}
    </div>
    <div class="grid-colspan-1 grid-rowspan-2">
        ${resize((width) => mapMedium(width))}
    </div>
    <div class="grid-colspan-1 grid-rowspan-2">
        ${resize((width) => mapSevere(width))}
    </div>
</div>
```
```html
${resetBtn}
```
TODO
## Gentse feesten
TODO
## Covid
TODO
