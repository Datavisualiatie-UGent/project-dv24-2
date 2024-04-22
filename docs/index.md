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
import {Query, getMonths, getYears, getCategories} from "./components/queries.js";

// misc
import * as echarts from "npm:echarts";
import {svg} from "npm:htl";
```

```js
// load data
const crimeData = await loadCrimeData();
const geoData = await loadGeometryData();
```
## Rankings
```js
const years = getYears().map(String);
const categories = getCategories();
const year = view(Inputs.select(years, {value: "2018", label: "Selecteer jaar:"}));
const category = view(Inputs.select(categories, {value: "Graffiti", label: "Selecteer categorie:"}));
```
```js
const res = new Query(crimeData)
    .filterByYear(Number(year))
    .filterByCategory(category)
    .groupByMonth()
    .result();
```
```js
const sortListAndGetNames = list => {
  return list.sort((a, b) => {
    if (a.total === b.total) {
      return a.region.localeCompare(b.region);
    }
    return a.total - b.total;
  }).map(obj => obj.region);
};

const sortedData = {}
Object.entries(res).forEach(([month, list]) => {
    sortedData[month] = sortListAndGetNames(list)
})
```

```js
const months = getMonths();
function getMonthIdx(monthName) {
    const idx = months.indexOf(monthName);
    if (idx !== -1) {
        return (idx + 1).toString().padStart(2, '0');
    } else {
        return null; // Month not found
    }
}
```

```js
const plotData = []
Object.entries(sortedData).forEach(([month, regions]) => {
    regions.forEach((name, idx) => {
        const dateString = `${year}-${getMonthIdx(month)}-01`;
        const [y, m, d] = dateString.split('-').map(Number);
        const dateDate = new Date(y, m - 1, d);
        plotData.push({
            Datum: dateDate,
            Regio: name,
            Ranking: idx + 1
        });
    });
})
```

```js
const plot = Plot.plot({
    color: {legend: true, columns: 4},
    marks: [
        Plot.ruleY([0]),
        Plot.lineY(plotData, {x: "Datum", y: "Ranking", stroke: "Regio", marker: true, tip: true}),
    ],
})
```

```js
// highlight on hover
d3.select(plot)
  .selectAll("path")
  .on("pointerenter", function() {
    d3.select(plot).selectAll("path").attr("opacity", 0.2);
    d3.select(this).attr("opacity", 1);
  });


// Reset the appearance when the pointer leaves the SVG
d3.select(plot).on("pointerleave", function() {
  d3.select(plot).selectAll("path").attr("opacity", 1);
});

// Attach the plot to the container DIV
d3.select('#chart').append(() => plot)
```
```js
display(plot)
```

## Map

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

