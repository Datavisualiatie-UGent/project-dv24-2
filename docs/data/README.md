# Data
The data used is about crime numbers in Ghent city and can be found [here](https://data.stad.gent/explore/?disjunctive.keyword&disjunctive.theme&sort=explore.popularity_score&refine.keyword=Criminaliteitscijfers).
## Folder structure

```bash
.
├── crimes # folder for the crime data
│   ├── crimeData.js
│   └── crime_data.json
├── geometry # folder for the geometry data
│   ├── geometryData.js
│   └── geometry_data.json
├── fetchRawData.js # function to fetch raw data from the api
├── loadJSON.js # function to load json from file
└── README.md
```

## Acquiring data
The data is fetched from the api's of the various present data sets. The data contains a lot of duplicate information, since each row contains all the info about the crime.
For this reason we provide 2 data objects to be used in the visualisations.
- [Geometry data](#geometry-data)
- [Crime data](#crime-data)
The api also only allow us to fetch 100 rows at a time. This makes the data fetching process very slow. For this reason, we allow for both data objects to
either be fetched from the api, or loaded from file. The latter is much faster.

### Geometry data
Ghent city is devided in separate regions. The geometry data provides a way to create a map of Ghent with these regions.

### Crime data
This is the actual data of the crimes. The data is a huge array of entries as followed:
```json
[
  {
    "year": 2020,               // year of incidents 
    "month": "juni",            // month of incidents
    "category": "Autodiefstal", // the type of the crime
    "region": "Binnenstad",     // where the crime took place
    "total": 8,                 // total amount of incedents
    "geo_point_2d": {...}       // 2d geometry data
  }
  ...
]
```
To work with the crime data we have implemented a [Query class in the queries.js file](../components/queries.js) that makes our life easier when querying the data.
You can read its documentation [here](../components/README.md).


### Acquiring data example
```js
import { fetchRawData } from './data/fetchRawData.js';

import { createCrimeData, loadCrimeData } from './data/crimes/crimeData.js';
import { createGeometryData, loadGeometryData } from './data/geometry/geometryData.js';

// option 1: fetch data //
// Get the raw data
const rawData = await fetchRawData();

// Get crime and geometry data from raw data
const crimeFromRaw = createCrimeData(rawData);
const geometryFromRaw = createGeometryData(rawData);

// option 2: load data //
// Get crime and geometry data from file
const crimeFromFile = loadCrimeData();
const geometryFromFile = loadGeometryData();
```
Note that `crimeFromRaw` and `crimeFromFile` will be identical. This is the same for `geometryFromRaw` and `geometryFromRaw`.
