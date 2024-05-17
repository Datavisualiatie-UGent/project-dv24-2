---
toc: false
theme: air
---
# Criminaliteitscijfers Gent
Brent Matthys, Warre Provoost en Mats Van Belle
***
```html
<div>
    Voor het vak Datavisualisatie aan UGent, gegeven door Bart Mesuere moesten we als project een dataset visualiseren. Deze pagina is het resultaat van dat project. We hebben gekozen om de <a href="https://data.stad.gent/explore/?disjunctive.keyword&disjunctive.theme&sort=explore.popularity_score&refine.keyword=Criminaliteitscijfers">dataset van Criminaliteitscijfers in Gent</a> te visualiseren.
    </br> </br>
    Voor de visualisaties maken we voornamelijk gebruik van <a href="https://observablehq.com/plot/">observable plot</a> en waar nodig vullen we dit aan met <a href="https://d3js.org/">d3</a>.
</div>
```

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
import {Query, getMonths, getYears, getCategories, getRegions, getLightCategories, getMediumCategories, getSevereCategories} from "./components/queries.js";
import {mapPlot, getDomainFromRange} from "./components/mapPlot.js"
import {interval} from "./components/intervalSlider.js"

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
const regionDefault = "Alle wijken"
const categoryCats = [categoryDefault].concat(categories)
const regionCats = [regionDefault].concat(regions)
```

## De dataset
```js
const parkInput_dataset = Inputs.toggle({label: "Toon parkeer overtredingen", value: true})
const showPark_dataset = Generators.input(parkInput_dataset);
```
```js
var baseQuery = new Query(crimeData).groupByCategory();
if(!showPark_dataset){
    baseQuery = baseQuery.delete("Parkeerovertredingen");
}
baseQuery = baseQuery.aggregate("category");
```

```js
let categoricalCrimes = baseQuery.groupByCategory().getTotal().aggregate("category").result().map(({category, total}) => ({categorie: category, totaal: total}));
let regionCrimes = baseQuery.groupByRegion().getTotal().aggregate("region").result().map(({region, total}) => ({wijk: region, totaal: total}));
let yearCrimes = baseQuery.groupByYear().getTotal().aggregate("year").result().map(({year, total}) => ({jaar: year, totaal: total}));
let monthCrimes = baseQuery.groupByMonth().getTotal().aggregate("month").result().map(({month, total}) => ({maand: month, totaal: total}));
```

```js
const getCategoryPlot = barChart(categoricalCrimes, "categorie", "totaal", "Categorie", "Aantal misdrijven");
const getRegionPlot = barChart(regionCrimes, "wijk", "totaal", "Wijk", "Aantal misdrijven");
const getYearPlot = barChart(yearCrimes, "jaar", "totaal", "Jaar", "Aantal misdrijven", false);
let monthCrimesSorted = Object.assign([], monthCrimes);
monthCrimesSorted.map((v, i) => v.maand = `${('0'+(i+1)).slice(-2)}  ${v.maand}`);
const getMonthPlot = barChart(monthCrimesSorted, "maand", "totaal", "Maand", "Aantal misdrijven", false);
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
            Bij het maken van visualisaties kan het een vertekend beeld geven wanneer een categorie heel dominant aanwezig is. Voor die reden zullen de visualisaties steeds de mogelijkheid hebben om getoond te worden met en zonder de parkeerovertredingen via een volgende knop:
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
          Op de figuur links zien we bijvoorbeeld dat het merendeel van de misdrijven in de binnenstad plaatsvindt. Dit kan te maken hebben met het aantal inwoners, een strengere controle of omdat de binnenstad gewoonweg een populaire locatie is. Wat de reden ook mag zijn, het kan belangrijk zijn om deze nuance in je achterhoofd te houden.
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
const sliderInput = interval(
    [0, dates.length - 1],
    {
        step: 1,
        value: [0, dates.length - 1],
        label: 'Selecteer periode',
        format: ([start, end]) => `${dates[start]} tem ${dates[end]}`
    }
)
const sliderValues = Generators.input(sliderInput);

const parkInput_mainMap = Inputs.toggle({label: "Toon parkeer overtredingen"});
const showPark_mainMap = Generators.input(parkInput_mainMap);

const scaleInput = Inputs.toggle({label: "Gebruik logaritmische schaal", value: true});
const logScale = Generators.input(scaleInput);

const mapCategoryInput = Inputs.select(categoryCats, {value: "Alle misdrijven", label: "Selecteer misdrijf"});
const mapCategoryValue = Generators.input(mapCategoryInput);
```
```js
const splitVals = sliderValues.split("-");
const minIdx = parseInt(splitVals[0]);
const maxIdx = parseInt(splitVals[1]) + 1;

const minVal = dates[minIdx];
const maxVal = dates[maxIdx];

const selectedDates = dates.slice(minIdx, maxIdx);
```

```js
let mapCrimes = new Query(crimeData);
// The map
if(!showPark_mainMap){
    mapCrimes = mapCrimes.groupByCategory().delete("Parkeerovertredingen").aggregate();
}
if(mapCategoryValue !== "Alle misdrijven"){
    mapCrimes = mapCrimes.filterByCategory(mapCategoryValue);
}
const domainCrimes = mapCrimes.groupByYear().groupByMonth().aggregate();
let mainMapDomain = getDomainFromRange(domainCrimes, dates, selectedDates.length)

mapCrimes = domainCrimes.selectMultiple(selectedDates).aggregate();
mapCrimes = mapCrimes.groupByRegion().getTotal().split();
const getMapPlot = mapPlot(mapCrimes, geoData, logScale, mainMapDomain);
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
            We kunnen de slider gebruiken om de misdrijven te visualiseren voor een periode doorheen de tijd. Merk hierbij op dat de schaal niet veranderd wanneer de duur van de periode gelijk blijft.
            Op deze manier kunnen we verschillende periodes vergelijken doorheen de tijd.
        </p>
    </div>
    <div>
        ${parkInput_mainMap}
        ${scaleInput}
        ${sliderInput}
        ${mapCategoryInput}
    </div>
</div>
```


## Criminaliteit doorheen de tijd

```js
// Inputs
const lineChartCategoryInput = Inputs.select(categoryCats, {value: "Alle misdrijven", label: "Selecteer misdrijf"});
const lineChartCategoryValue = Generators.input(lineChartCategoryInput);
const lineChartRegionInput = Inputs.select(regionCats, {value: "Alle wijken", label: "Selecteer wijk"});
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
let resultPerMonthCategory = resultPerMonthCategoryQuery.groupByMonth()
                                                          .aggregate("n.a.", convert_to_date_string)
                                                          .deleteMultiple(["2023-09-01", "2023-10-01", "2023-11-01", "2023-12-01"])
                                                          .getTotal()
                                                          .aggregate("date")
                                                          .result();

resultPerMonthCategory= resultPerMonthCategory.map(({date, total}) => ({
    datum: date,
    totaal: total
}))


const getCategoryLineChart = lineChart(resultPerMonthCategory, "datum", "totaal");

// Region
let resultPerMonthRegion = new Query(crimeData).filterByRegion(region)
                                                 .groupByYear()
                                                 .groupByMonth()
                                                 .aggregate("n.a.", convert_to_date_string)
                                                 .deleteMultiple(["2023-09-01", "2023-10-01", "2023-11-01", "2023-12-01"])
                                                 .getTotal()
                                                 .aggregate("date")
                                                 .result();

resultPerMonthRegion= resultPerMonthRegion.map(({date, total}) => ({
    datum: date,
    totaal: total
}))

const getRegionLineChart = lineChart(resultPerMonthRegion, "datum", "totaal");
```

```html
<div class="grid grid-cols-4">
    <div class="grid-colspan-2">
        <div>
            <h4>Trend in het aantal misdrijven voor categorie: ${lineChartCategoryInput}</h4>
            ${getCategoryLineChart}
        </div>
    </div>
    <div class="grid-colspan-2">
        <div>
            <h4>Trend in het aantal misdrijven in de wijk: ${lineChartRegionInput}</h4>
            ${getRegionLineChart}
        </div>
    </div>
</div>
<div>
    Zoals we eerder al opmerkten bestaat de dataset uit talrijke categoriëen. Het is interessant om te bekijken wanneer welk soort criminaliteit het meest optreedt. </br> </br>
    In deze interactieve linechart kan je bekijken in welke periode een bepaald soort criminaliteit het meest prevalent is. Sommige van deze periodes zijn te verklaren via externe factoren, waar we ook later op zullen ingaan. Het kan echter al zeer interessant zijn om zelf eens met de data te spelen en misschien ontdek je zelf enkele verbanden. </br> </br>
    Verder kan je ook bekijken wanneer een wijk het meest turbulent is. Sommige wijken zien tijdens de zomermaanden een sterke stijging/daling in het aantal misdrijven. In andere wijken zien we ook een duidelijk stijgende of dalende trend in de voorbije jaren. </br> </br>
    Sommige van deze conclusies worden best echter met een korreltje zout genomen. Bekijk bijvoorbeeld de wijk Zwijnaarde: hier zien we een heel sterke stijging in de criminaliteitscijfers na 2022. Alhoewel hier waarschijnlijk een goede reden voor te vinden is (bekijk de Corona-epidemie in een later hoofdstuk), blijken deze datapunten niet super relevant aangezien er in Zwijnaarde eigenlijk altijd weinig criminaliteit is waardoor fluctuaties groter lijken. </br> </br>
</div>
```

## De ernst van de misdrijven

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
Bij het bekijken van criminaliteitcijfers is het interessant om een vergelijking te maken tussen de ernstigheid van de misdrijven. We willen steeds dat het merendeel van de misdrijven slechts een licht misdrijf zijn en dat ernstige misdrijven slechts uitzonderlijk voorkomen.
```
```html
Dit tonen we aan in onderstaande visualisatie. We hebben een rangschikking gemaakt in de categorieën van licht naar ernstig. De tabel laat toe om deze rangschikking te wijzigen.

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
Herstel de rangschikking: ${resetBtn}
```

## Gentse feesten

```js
let resultZakkenrollerijBinnenstad = new Query(crimeData).filterByCategory("Zakkenrollerij")
                                                           .filterByRegion("Binnenstad")
                                                           .groupByYear()
                                                           .groupByMonth()
                                                           .aggregate("n.a.", convert_to_date_string)
                                                           .deleteMultiple(["2023-09-01", "2023-10-01", "2023-11-01", "2023-12-01"])
                                                           .getTotal()
                                                           .aggregate("date")
                                                           .result();
// translate to duch
resultZakkenrollerijBinnenstad = resultZakkenrollerijBinnenstad.map(({date, total}) => ({
    datum: date,
    totaal: total
}))

const getZakkenrollerijBinnenstadLineChart = lineChart(resultZakkenrollerijBinnenstad, "datum", "totaal", ["2018-07-01", "2019-07-01", "2022-07-01", "2023-07-01"], ["Gentse Feesten 2018", "Gentse Feesten 2019", "Gentse Feesten 2022", "Gentse Feesten 2023"]);
```

```html
<div class="grid grid-cols-4">
  <div class="grid-colspan-2">
    <p>
        Een belangrijke opmerking wanneer we de trend van het aantal misdrijven doorheen de tijd bekijken, is dat we soms een piek krijgen tijdens de zomermaanden.
        Dit is vooral opmerkelijk bij de hoeveelheid zakkenrollerij. Wanneer we bekijken waar die zakkenrollerij juist plaatsvond, zagen we op de heatmap een duidelijke overheersing in de binnenstad.
        Alhoewel de zomermaanden waarschijnlijk een hotspot voor zakkenrollerij zijn omdat vele gentenaars dan genieten van hun vakantie in de vele winkelstraatjes in gent vonden we deze data toch opmerkelijk.
    </p>
    <p>
        Na wat na te denken kwamen we op het grootste evenement in Gent terecht dat toevallig ook in de zomermaanden plaatsvind: "De Gentse Feesten". Om de criminaliteit rond de Gentse feesten duidelijk te maken hebben we op de figuur rechts de zakkenrollerij in de binnenstad geplot.
        Met enkele rode lijnen staan de datums van de Gentse Feesten aangeduid. Merk op dat in 2020 en 2021 er geen lijn aangeduid staat, de Gentse Feesten werden deze jaren afgelast doorwege de coronapandemie.
    </p>  
  </div>
  <div class="grid-colspan-2">
      <div>
          <h4>Trend in de zakkenrollerij in de binnenstad.</h4>
          ${getZakkenrollerijBinnenstadLineChart}
      </div>
  </div>
</div>
```

## Criminaliteit tijdens Covid
```js
let zakrollers = new Query(crimeData).filterByCategory("Zakkenrollerij")
                                                 .groupByYear()
                                                 .groupByMonth()
                                                 .aggregate("n.a.", convert_to_date_string)
                                                 .deleteMultiple(["2023-09-01", "2023-10-01", "2023-11-01", "2023-12-01"])
                                                 .getTotal()
                                                 .aggregate("date")
                                                 .result();
// translate to duch
zakrollers = zakrollers.map(({date, total}) => ({
    datum: date,
    totaal: total
}))

const covidPlotZak = lineChart(zakrollers, "datum", "totaal", ["2020-03-01", "2022-05-01"], ["Start Covid", "Einde Covid"])

```

```js
const noParking = getCategories().filter(c => c !== "Parkeerovertredingen");
let allCrime = new Query(crimeData).filterByCategories(noParking)
                                    .groupByYear()
                                    .groupByMonth()
                                    .aggregate("n.a.", convert_to_date_string)
                                    .deleteMultiple(["2023-09-01", "2023-10-01", "2023-11-01", "2023-12-01"])
                                    .getTotal()
                                    .aggregate("date")
                                    .result();
// translate to duch
allCrime = allCrime.map(({date, total}) => ({
    datum: date,
    totaal: total
}))

const covidPlotAll = lineChart(allCrime, "datum", "totaal", ["2020-03-01", "2022-05-01"], ["Start Covid", "Einde Covid"])

```
```html
<div class="grid grid-cols-2">
    <div class="grid-colspan-1">
        <h4>Alle misdaden - zonder parkeerovertredingen</h4>
        <p>
            In deze grafiek wordt het aantal misdaden in de stad gedurende de COVID-19-pandemie weergegeven. Opmerkelijk is de daling in criminaliteit op het moment dat de lockdown net ingevoerd werd. Maar er is ook te zien dat het aantal misdaden snel terugkeerde naar het oorspronkelijke niveau tijdens de zomermaanden.
        </p>
    </div>
 
    <div class="grid-colspan-1">
        <h4>Zakkenrollerij</h4>
        <p>
            In deze grafiek wordt specifiek het aantal gevallen van zakkenrollen in de stad weergegeven. Opvallend is de significante afname van dit type misdrijf tijdens covid. Deze daling kan worden toegeschreven aan verschillende factoren. De verminderde drukte in openbare ruimtes en het toepassen van social distancing maakt het zakkenrollen moeilijk.
        </p>
    </div>   
</div>
<div class="grid grid-cols-2">
    <div class="grid-colspan-1">
      ${covidPlotAll}
    </div>
    <div class="grid-colspan-1">
      ${covidPlotZak}
    </div>
</div>
```
