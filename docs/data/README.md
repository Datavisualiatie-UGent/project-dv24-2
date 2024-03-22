# Data
The data used is about crime numbers in Ghent city and can be found [here](https://data.stad.gent/explore/?disjunctive.keyword&disjunctive.theme&sort=explore.popularity_score&refine.keyword=Criminaliteitscijfers).

## Data processing
The data is fetched from the api's of the various present data sets. The data contains a lot of duplicate information, since each row contains all the info about the crime.
The data is processed into the following json format:
```json
{
    "Binnenstad": {
        "geometry": {...}, // The geometry data as provided by the api.
        "categorys": {
            "Autodiefstal": [
                {
                    "year": 2020,           // year of incidents 
                    "month": "juni",        // month of incidents
                    "total": 8,             // total amount of incedents
                    "geo_point_2d": {...}   // 2d geometry data
                }
            ],
            ...
            // Each category has it's own list of data rows
        }
    },
    ...
    // Each sub region of Ghent has it's own json
}
```

You can fetch the data like so:
```ts
const data = await FileAttachment("data/data.json").json();
```
