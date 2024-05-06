---
toc: false
theme: air
---
<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 2rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>

# Criminaliteitscijfers Gent
Brent Matthys, Warre Provoost en Mats Van Belle
***

Voor het vak Datavisualisatie aan UGent, gegeven door Bart Mesuere moesten we als project een dataset visualiseren. Deze pagina is het resultaat van dat project. We hebben gekozen om de [dataset van Criminaliteitscijfers in Gent](https://data.stad.gent/explore/?disjunctive.keyword&disjunctive.theme&sort=explore.popularity_score&refine.keyword=Criminaliteitscijfers) te visualiseren.
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
const categories = getCategories();
```


## De dataset

```js
const showParkCrimes = Inputs.checkbox([""], {label: "Toon parkeer overtredingen:"});
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
        ${showParkCrimes}
        ${resize((width) => getCategoryPlot(width))}
  </div>
</div>
```
## Misdrijven per wijk
Groot Gent bestaat uit 25 wijken, zoals te zien is op de onderstaande kaart.
```js
const crimes = new Query(crimeData).groupByRegion().getTotal().split();
geoData.features.forEach((g) => {
    // add crimes 
    const index = crimes.keys.indexOf(g.properties.name);
    g.properties.crimes = crimes.values[index];
})
```

```js show
const mapScope = d3.geoCircle().center([3.73, 51.085]).radius(0.11).precision(2)()
```
```js
Plot.plot({
    projection: {
        type: "mercator",
        n:800,
        domain: mapScope,
    },
    color: {
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




## TODO: add selectors here to select year/period/etc 
if the data object is modified all further graphs will change
We will do this via a map.


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
## Rankings
```js
const years = getYears().map(String);
const year = view(Inputs.select(years, {value: "2018", label: "Selecteer jaar:"}));
const category_parallel = view(Inputs.select(categories, {value: "Graffiti", label: "Selecteer categorie:"}));
```

```js
display(parallel(crimeData, year, category_parallel));
```
## Amount of crimes
We can then take a look at the amount of crimes in each category and in each year.

```js
const amountOfCrimesPerCategoryChart = echarts.init(display(html`<div style="width: 1000px; height:650px;"></div>`));

const queryResult = new Query(crimeData).groupByCategory().getTotal().split();

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

