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

```js
// imports
import {getRegions, getCategorys} from "./components/querys.js";

// load the data
const data = await FileAttachment("data/data.json").json();
const i = data.Binnenstad

```

```js echo
getRegions(data)
```
```js echo
data
```
```js
import {createGeoData} from "./components/geoData.js"
const geoData = createGeoData(data)
console.log(geoData)
```

```js
import {svg} from "npm:htl";
import { gentMap} from "./components/cityMap.js"

const nj = (await (await FileAttachment("data/nj-tracts.json")).json())

```
```js 
const gentSVG = gentMap(geoData)
```

```js
svg`${gentSVG}`
```
```js echo
nj
```


