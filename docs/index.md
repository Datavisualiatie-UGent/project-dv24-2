---
toc: false
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

# Datavisualisatie

## TODO: add selectors here to select year/period/etc 
if the data object is modified all further graphs will change
We will do this via a map.

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
```

```js
// load data
const crimeData = await loadCrimeData();
const geoData = await loadGeometryData();

// basic data
const months = getMonths();
const categories = getCategories();
```
## Map
```html
<div id="legend"></div>

```
```html
<div id="map_div"></div>
```
```js
const gentSVG = cityMap(geoData,crimeData)
display(gentSVG.node())

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

