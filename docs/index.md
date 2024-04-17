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
import {getRegions, Query} from "./components/queries.js";

// misc
import * as echarts from "npm:echarts";
import {svg} from "npm:htl";
```

```js
// load data
const crimeData = await loadCrimeData();
const geoData = await loadGeometryData();
```

```js
const gentSVG = cityMap(geoData)
```

```js
svg`${gentSVG}`
```

## Amount of crimes
We can first take a look at the amount of crimes in each category and in each year.

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
