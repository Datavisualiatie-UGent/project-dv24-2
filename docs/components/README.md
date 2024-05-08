# Queries.js
The queries.js file includes a lot of tools that help with querying the crime dataset.
The file includes a few hardcoded [getter-functions](#get-methods) and a generic [Query-class](#query-class) to query the crime_data.

## Query-class
The queries.js includes a query-class to easily query the crime dataset. Because most query-class-functions also return a new query-class-object, we can easily chain these query commands.
This should increase readability in the final code, which should already be shown. It is however very important to know the underlying structure of the query-class to easily know what we are doing and how we are manipulating the data.
This documentation will provide a detailed overview of all the methods in the query-class, what they do, and how we can use them with some example code.

**Table of contents**

|                                         |                                                                       |
|-----------------------------------------|-----------------------------------------------------------------------|
| [Query()](#query)                       | Create a new query with the data (constructor).                       |
| [groupByRegion()](#groupByRegion)       | Group the data by region.                                             |
| [groupByCategory()](#groupByCategory)   | Group the data by category.                                           |
| [groupByYear()](#groupByYear)           | Group the data by year.                                               |
| [groupByMonth()](#groupByMonth)         | Group the data by month.                                              |
| [filterByRegion()](#filterByRegion)     | Filter the query by region.                                           |
| [filterByCategory()](#filterByCategory) | Filter the query by category.                                         |
| [filterByYear()](#filterByYear)         | Filter the query by year.                                             |
| [filterByMonth()](#filterByMonth)       | Filter the query by month.                                            |
| [filterBy()](#filterBy)                 | Filter the query by a given filter function.                          |
| [filterMin()](#filterMin)               | Filter the result to only include the entries with the minimum total. |
| [filterMax()](#filterMax)               | Filter the result to only include the entries with the maximum total. |
| [getTotal()](#getTotal)                 | Calculate the total amount of crimes.                                 |
| [getCount()](#getCount)                 | Calculate the total amount of entries.                                |
| [getAverage()](#getAverage)             | Calculate the average amount of crimes.                               |
| [split()](#split)                       | Split a grouped object in a key and value array.                      |
| [result()](#result)                     | Acquire the result of the query.                                      |
| [aggregate()](#aggregate)               | Aggregate the outer group back into the query result.                 |
| [select()](#select)                     | Select a single group from the different options in the map.          |
| [selectMultiple()](#selectMultiple)     | Select multiple groups from the different options in the map.         |
| [delete()](#delete)                     | Delete a single group from the different options in the map.          |
| [deleteMultiple()](#deleteMultiple)     | Delete multiple groups from the different options in the map.         |
| ...                                     | ...                                                                   |

### Query()
Create a new query with the data. Constructor of the Query-class.

This constructor is always used to initialize a query and will require the basic crime_data 99% of the time.

|                |                        |
|----------------|------------------------|
| **Parameters** | [data, final: boolean] |
| **Returns**    | Query-class            |

#### Example
```js
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {Query} from "./components/queries.js";

const crimeData = await loadCrimeData();
const crimeQuery = new Query(crimeData);
console.log(crimeQuery);

> Query {data: JSONArray(27740), _final: false} // Query object that is the start of the query.
```

### groupByRegion()
Group the data by region. 

This means that we change the data of the query to a json-object that maps the regions acquired from the [getRegions()](#getregions) method to a filtered query that only includes entries with the given region.

*This method can handle grouped queries and will group inside previous groups.*

|                |             |
|----------------|-------------|
| **Parameters** | (none)      |
| **Returns**    | Query-class |

#### Example
```js
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {Query} from "./components/queries.js";

const crimeData = await loadCrimeData();
const queryResult = new Query(crimeData).groupByRegion().result();
console.log(queryResult);

> JSONObject { // JSONObject with every array only including entries from the corresponding region.
 "Muide - Meulestede - Afrikalaan" : JSONArray(1066)[Object, Object, Object, …], 
 "Binnenstad": JSONArray(1078)[Object, Object, Object, …],
 "Bloemekenswijk": JSONArray(1068)[Object, Object, Object, …],
 "Drongen": JSONArray(1064)[Object, Object, Object, …],
 … more
}
```

### groupByCategory()
Group the data by category.

This means that we change the data of the query to a json-object that maps the regions acquired from the [getCategories()](#getcategories) method to a filtered query that only includes entries with the given category.

*This method can handle grouped queries and will group inside previous groups.*

|                |             |
|----------------|-------------|
| **Parameters** | (none)      |
| **Returns**    | Query-class |

#### Example
```js
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {Query} from "./components/queries.js";

const crimeData = await loadCrimeData();
const queryResult = new Query(crimeData).groupByCategory().result();
console.log(queryResult);

> JSONObject { // JSONObject with every array only including entries from the corresponding category.
 "Diefstal gewapenderhand" : JSONArray(1768)[Object, Object, Object, …], 
 "Diefstal met geweld zonder wapen": JSONArray(1769)[Object, Object, Object, …],
 "Geluidshinder": JSONArray(1768)[Object, Object, Object, …],
 "Sluikstorten": JSONArray(1771)[Object, Object, Object, …],
 … more
}
```

### groupByYear()
Group the data by year.

This means that we change the data of the query to a json-object that maps the regions acquired from the [getYears()](#getyears) method to a filtered query that only includes entries from the given year.

*This method can handle grouped queries and will group inside previous groups.*

|                |             |
|----------------|-------------|
| **Parameters** | (none)      |
| **Returns**    | Query-class |

#### Example
```js
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {Query} from "./components/queries.js";

const crimeData = await loadCrimeData();
const queryResult = new Query(crimeData).groupByYear().result();
console.log(queryResult);

> JSONObject { // JSONObject with every array only including entries from the corresponding year.
 "2018" : JSONArray(4680)[Object, Object, Object, …],
 "2019" : JSONArray(4680)[Object, Object, Object, …],
 "2020" : JSONArray(4992)[Object, Object, Object, …],
 "2021" : JSONArray(4992)[Object, Object, Object, …],
 "2022" : JSONArray(4992)[Object, Object, Object, …],
 "2023" : JSONArray(3404)[Object, Object, Object, …]
}
```

### groupByMonth()
Group the data by month.

This means that we change the data of the query to a json-object that maps the regions acquired from the [getMonths()](#getmonths) method to a filtered query that only includes entries from the given month.

*This method can handle grouped queries and will group inside previous groups.*

|                |             |
|----------------|-------------|
| **Parameters** | (none)      |
| **Returns**    | Query-class |

#### Example
```js
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {Query} from "./components/queries.js";

const crimeData = await loadCrimeData();
const queryResult = new Query(crimeData).groupByMonth().result();
console.log(queryResult);

> JSONObject { // JSONObject with every array only including entries from the corresponding month.
 "januari" : JSONArray(2448)[Object, Object, Object, …],
 "februari" : JSONArray(2450)[Object, Object, Object, …],
 "maart" : JSONArray(2453)[Object, Object, Object, …],
 "april" : JSONArray(2462)[Object, Object, Object, …],
 … more
}
```

### filterByRegion()
Filter the query by region.

This means that we only keep the entries where the region matches our given region.
You can take a look at the different regions [here](#getregions).
For more complex filtering options you can also look at the [filterBy](#filterBy) method.

*This method can handle grouped queries and will filter per group.*

|                |                  |
|----------------|------------------|
| **Parameters** | [region: string] |
| **Returns**    | Query-class      |

#### Example
```js
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {Query} from "./components/queries.js";

const crimeData = await loadCrimeData();
const queryResult = new Query(crimeData).filterByRegion("Drongen").result();
console.log(queryResult);

> JSONArray(1064) [ // JSONArray with only the entries from the filtered region (Drongen).
 JSONObject{"year":…, "month":…, "category":…, "region":"Drongen", …},
 JSONObject{"year":…, "month":…, "category":…, "region":"Drongen", …},
 JSONObject{"year":…, "month":…, "category":…, "region":"Drongen", …},
 JSONObject{"year":…, "month":…, "category":…, "region":"Drongen", …},
 … more
]
```

### filterByCategory()
Filter the query by category.

This means that we only keep the entries where the category matches our given category.
You can take a look at the different categories [here](#getcategories).
For more complex filtering options you can also look at the [filterBy](#filterBy) method.

*This method can handle grouped queries and will filter per group.*

|                |                    |
|----------------|--------------------|
| **Parameters** | [category: string] |
| **Returns**    | Query-class        |

#### Example
```js
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {Query} from "./components/queries.js";

const crimeData = await loadCrimeData();
const queryResult = new Query(crimeData).filterByCategory("Graffiti").result();
console.log(queryResult);

> JSONArray(1769) [ // JSONArray with only the entries from the filtered category (Graffiti).
 JSONObject{"year":…, "month":…, "category":"Graffiti", "region":…, …},
 JSONObject{"year":…, "month":…, "category":"Graffiti", "region":…, …},
 JSONObject{"year":…, "month":…, "category":"Graffiti", "region":…, …},
 JSONObject{"year":…, "month":…, "category":"Graffiti", "region":…, …},
 … more
]
```

### filterByYear()
Filter the query by year.

This means that we only keep the entries where the year matches our given year.
You can take a look at the different years [here](#getyears).
For more complex filtering options you can also look at the [filterBy](#filterBy) method.

*This method can handle grouped queries and will filter per group.*

|                |                |
|----------------|----------------|
| **Parameters** | [year: number] |
| **Returns**    | Query-class    |

#### Example
```js
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {Query} from "./components/queries.js";

const crimeData = await loadCrimeData();
const queryResult = new Query(crimeData).filterByYear(2023).result();
console.log(queryResult);

> JSONArray(3404) [ // JSONArray with only the entries from the filtered year (2023).
 JSONObject{"year":"2023", "month":…, "category":…, "region":…, …},
 JSONObject{"year":"2023", "month":…, "category":…, "region":…, …},
 JSONObject{"year":"2023", "month":…, "category":…, "region":…, …},
 JSONObject{"year":"2023", "month":…, "category":…, "region":…, …},
 … more
]
```

### filterByMonth()
Filter the query by month.

This means that we only keep the entries where the month matches our given month.
You can take a look at the different months [here](#getmonths).
For more complex filtering options you can also look at the [filterBy](#filterBy) method.

*This method can handle grouped queries and will filter per group.*

|                |                 |
|----------------|-----------------|
| **Parameters** | [month: string] |
| **Returns**    | Query-class     |

#### Example
```js
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {Query} from "./components/queries.js";

const crimeData = await loadCrimeData();
const queryResult = new Query(crimeData).filterByMonth("maart").result();
console.log(queryResult);

> JSONArray(2453) [ // JSONArray with only the entries from the filtered month (maart).
 JSONObject{"year":…, "month":"maart", "category":…, "region":…, …},
 JSONObject{"year":…, "month":"maart", "category":…, "region":…, …},
 JSONObject{"year":…, "month":"maart", "category":…, "region":…, …},
 JSONObject{"year":…, "month":"maart", "category":…, "region":…, …},
 … more
]
```

### filterBy()
Filter the query by a given filter function.

This means that we only keep the entries where the objects match those for which the filter function returns true.

*This method can handle grouped queries and will filter per group.*

|                |                                                    |
|----------------|----------------------------------------------------|
| **Parameters** | [filter_function: Function (obj: Object) => bool ] |
| **Returns**    | Query-class                                        |

#### Example
```js
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {Query} from "./components/queries.js";

const crimeData = await loadCrimeData();
const queryResult = new Query(crimeData).filterBy((obj) =>
        obj["category"] !== "Parkeerovertredingen" && obj["region"] !== "Binnenstad"
).result();
console.log(queryResult);

> JSONArray(24945) [ // JSONArray without the entries that match the filter function (geen Parkeerovertredingen & geen entries uit de binnenstad).
 JSONObject{"year":…, "month":"maart", "category":…, "region":…, …},
 JSONObject{"year":…, "month":"maart", "category":…, "region":…, …},
 JSONObject{"year":…, "month":"maart", "category":…, "region":…, …},
 JSONObject{"year":…, "month":"maart", "category":…, "region":…, …},
 … more
]
```

### filterMin()
Filter the query to only include entries with the lowest total.

This means that we only keep the entries where the total is minimal.

*This method can handle grouped queries and will take the minimal entries per group.*

|                |             |
|----------------|-------------|
| **Parameters** | (none)      |
| **Returns**    | Query-class |

#### Example
```js
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {Query} from "./components/queries.js";

const crimeData = await loadCrimeData();
const queryResult = new Query(crimeData).filterMin().result();
console.log(queryResult);

> JSONArray(13327) [ // JSONArray with only the entries with the lowest total (0).
 JSONObject{"year":…, "month":…, "category":…, "region":…, "total":0, …},
 JSONObject{"year":…, "month":…, "category":…, "region":…, "total":0, …},
 JSONObject{"year":…, "month":…, "category":…, "region":…, "total":0, …},
 JSONObject{"year":…, "month":…, "category":…, "region":…, "total":0, …},
 … more
]
```

### filterMax()
Filter the query to only include entries with the highest total.

This means that we only keep the entries where the total is maximal.

*This method can handle grouped queries and will take the maximal entries per group.*

|                |             |
|----------------|-------------|
| **Parameters** | (none)      |
| **Returns**    | Query-class |

#### Example
```js
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {Query} from "./components/queries.js";

const crimeData = await loadCrimeData();
const queryResult = new Query(crimeData).filterMax().result();
console.log(queryResult);

> JSONArray(1) [ // JSONArray with only the entries with the highest total (903).
 JSONObject {
    year: "2018", 
    month: "juli",
    category: "Parkeerovertredingen", 
    region: "Binnenstad", 
    total: 903, 
    geo_point_2d: Object
 }
]
```

### getTotal()
Calculate the total amount of crimes.

This means that we take the sum of the total crimes in the query.

*This method can handle grouped queries and will calculate the total per group.*

**!!!** *This method will finalize the query, meaning it can not be extended anymore.*

|                |             |
|----------------|-------------|
| **Parameters** | (none)      |
| **Returns**    | Query-class |

#### Example
```js
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {Query} from "./components/queries.js";

const crimeData = await loadCrimeData();
const queryResult = new Query(crimeData).getTotal().result();
console.log(queryResult);

> 188787 // The total amount of registered crimes in the database.
```

### getCount()
Calculate the total amount of entries.

This means that we take the length of the array.

*This method can handle grouped queries and will calculate the count per group.*

**!!!** *This method will finalize the query, meaning it can not be extended anymore.*

|                |             |
|----------------|-------------|
| **Parameters** | (none)      |
| **Returns**    | Query-class |

#### Example
```js
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {Query} from "./components/queries.js";

const crimeData = await loadCrimeData();
const queryResult = new Query(crimeData).getCount().result();
console.log(queryResult);

> 27740 // The total amount of entries in the database.
```

### getAverage()
Calculate the average amount of crimes per entry.

This means that we will just divide the [total](#gettotal) with the [count](#getcount).

*This method can handle grouped queries and will calculate the average per group.*

**!!!** *This method will finalize the query, meaning it can not be extended anymore.*

|                |             |
|----------------|-------------|
| **Parameters** | (none)      |
| **Returns**    | Query-class |

#### Example
```js
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {Query} from "./components/queries.js";

const crimeData = await loadCrimeData();
const queryResult = new Query(crimeData).getAverage().result();
console.log(queryResult);

> 6.805587599134824 // The average amount of crimes per entry in the database.
```

### split()
Split a grouped object in a key and value array.

This is mainly used to end the query. For basic visualizations it could be interesting to acquire 2 different arrays: for example for the x and y axis.

**This method requires a grouped query and will throw an error otherwise.**

**!!!** *This method does not return a Query-class and is thus finalised.*

|                |                                                      |
|----------------|------------------------------------------------------|
| **Parameters** | (none)                                               |
| **Returns**    | Object{keys:Array\<string\>, values:Array\<Object\>} |

#### Example
```js
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {Query} from "./components/queries.js";

const crimeData = await loadCrimeData();
const queryResult = new Query(crimeData).groupByYear().getTotal().split();
console.log(queryResult);

> { // An object with the amount of crimes per year.
    "keys": ["2018", "2019", "2020", "2021", "2022", "2023"]
    "values": [38412, 36169, 26490, 30562, 32194, 24960]
  }
```

### result()
Returns the result of the query.

This is mainly used to end the query. It just returns what's in the data field of the Query. 
It is mainly syntactic sugar.

**!!!** *This method does not return a Query-class and is thus finalised.*

|                |        |
|----------------|--------|
| **Parameters** | (none) |
| **Returns**    | Object |

#### Example
```js
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {Query} from "./components/queries.js";

const crimeData = await loadCrimeData();
const queryResult = new Query(crimeData).result();
console.log(queryResult == crimeData);

> true
```

### aggregate()
Aggregate the outer group back into the query result.

This can be used to merge group keys and to un-finalize grouped final queries by re-introducing them as totals.
It can also undo a previous grouping operation.

**This method requires a grouped query and will throw an error otherwise.**

**!!!** *This method will un-finalize some finalised queries and can be a bit confusing.*

|                |                                                                                                   |
|----------------|---------------------------------------------------------------------------------------------------|
| **Parameters** | [keyWhenNumber: string, combineFunction: Function (outerKey: string, innerKey: string) => string] |
| **Returns**    | Object                                                                                            |

Both parameters have default values:

`keyWhenNumber = "key"` 

`combineFunction = (outerKey, innerKey) => '${outerKey} - ${innerKey}'`)

#### Example
```js
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {Query} from "./components/queries.js";

const crimeData = await loadCrimeData();
const queryResult = new Query(crimeData).groupByYear().groupByMonth().aggregate().result();
console.log(queryResult);

> JSONObject { // JSONObject with every array only including entries from the corresponding year and month given as a single key.
 "2018 - januari" : JSONArray(390)[Object, Object, Object, …],
 "2018 - februari" : JSONArray(390)[Object, Object, Object, …],
 "2018 - maart" : JSONArray(390)[Object, Object, Object, …],
 "2018 - april" : JSONArray(390)[Object, Object, Object, …],
 … more
}

const queryResult2 = new Query(crimeData).groupByYear().getTotal().aggregate("year").result();
console.log(queryResult2);

> JSONArray(6) [ // See the total amount of crimes per year but as single & unfinalized JSONObjects.
 JSONObject{year: "2018", total: 38412},
 JSONObject{year: "2019", total: 36169},
 JSONObject{year: "2020", total: 26490},
 JSONObject{year: "2021", total: 30562},
 JSONObject{year: "2022", total: 32194},
 JSONObject{year: "2023", total: 24960}
]
```

### select()
Select a single group from the different options in the map.

This is mainly used to end the query when working with aggregated group keys. Selecting after a normal groupBy is the same as filterBy.

**This method requires a grouped query and will throw an error otherwise.**

|                |            |
|----------------|------------|
| **Parameters** | entry: Key |
| **Returns**    | Object     |

#### Example
```js
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {Query} from "./components/queries.js";

const crimeData = await loadCrimeData();
const queryResult = new Query(crimeData).groupByYear().select(2018).result();
console.log(queryResult);

> JSONArray(4680) [ // JSONArray with only the entries from the selected year (2018).
 JSONObject{"year":"2018", "month":…, "category":…, "region":…, …},
 JSONObject{"year":"2018", "month":…, "category":…, "region":…, …},
 JSONObject{"year":"2018", "month":…, "category":…, "region":…, …},
 JSONObject{"year":"2018", "month":…, "category":…, "region":…, …},
 … more
]
```

### selectMultiple()
Select multiple groups from the different options in the map.

This is used for when we only want to work with a part of the dataset.
This does not combine the data back into a single array but only keeps the selected object keys, that way this function also works on doubly-grouped Queries.
When you want to combine the data back you can take a look at the [aggregate](#aggregate) function. 
For more complex filtering options you can also look at the [filterBy](#filterBy) method.

**This method requires a grouped query and will throw an error otherwise.**

|                |                       |
|----------------|-----------------------|
| **Parameters** | entries: Array\<Key\> |
| **Returns**    | Object                |

#### Example
```js
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {Query} from "./components/queries.js";

const crimeData = await loadCrimeData();
const queryResult = new Query(crimeData).groupByYear().selectMultiple(["2019", "2020"]).result();
console.log(queryResult);

> JSONObject { // JSONObject with only the entries from the selected years (2019 & 2020).
    "2019" : JSONArray(4680),
    "2020" : JSONArray(4992),
}
```

### delete()
Delete a single group from the different options in the map.

This is mainly used to ignore a group when working with aggregated group keys.
For more complex filtering options you can also look at the [filterBy](#filterBy) method.

**This method requires a grouped query and will throw an error otherwise.**

|                |            |
|----------------|------------|
| **Parameters** | entry: Key |
| **Returns**    | Object     |

#### Example
```js
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {Query} from "./components/queries.js";

const crimeData = await loadCrimeData();
const queryResult = new Query(crimeData).groupByCategory().delete("Parkeerovertredingen").result();
console.log(queryResult);

> JSONObject { // JSONObject without the ignored entry (Parkeerovertredingen).
 "Diefstal gewapenderhand" : JSONArray(1768)[Object, Object, Object, …],
 "Diefstal met geweld zonder wapen": JSONArray(1769)[Object, Object, Object, …],
 "Geluidshinder": JSONArray(1768)[Object, Object, Object, …],
 "Sluikstorten": JSONArray(1771)[Object, Object, Object, …],
 … more
}
```

### deleteMultiple()
Delete multiple groups from the different options in the map.

This is mainly used to ignore some groups when working with aggregated group keys.
For more complex filtering options you can also look at the [filterBy](#filterBy) method.

**This method requires a grouped query and will throw an error otherwise.**

|                |                       |
|----------------|-----------------------|
| **Parameters** | entries: Array\<Key\> |
| **Returns**    | Object                |

#### Example
```js
import {loadCrimeData} from "./data/crimes/crimeData.js";
import {Query} from "./components/queries.js";

const crimeData = await loadCrimeData();
const queryResult = new Query(crimeData).groupByCategory().deleteMultiple(["Parkeerovertredingen", "Fietsdiefstal"]).result();
console.log(queryResult);

> JSONObject { // JSONObject without the ignored entry (Parkeerovertredingen).
 "Diefstal gewapenderhand" : JSONArray(1768)[Object, Object, Object, …],
 "Diefstal met geweld zonder wapen": JSONArray(1769)[Object, Object, Object, …],
 "Geluidshinder": JSONArray(1768)[Object, Object, Object, …],
 "Sluikstorten": JSONArray(1771)[Object, Object, Object, …],
 … more
}
```

## get-methods
The queries.js file includes a few basic and hardcoded get-methods about the specific dataset we are working with. 
They are included for easy usage within and outside of the [Query-class](#query-class) without the need of asking about the dataset at execution time.
This also solves the problem for when the data entries are limited after querying and do not include entries with corresponding data. 
These methods keep the program consistent.

**Table of contents**

|                                   |                                         |
|-----------------------------------|-----------------------------------------|
| [getRegions()](#getregions)       | Get a list of all the regions of Ghent. |
| [getCategories()](#getcategories) | Get a list of all the crime categories. |
| [getYears()](#getyears)           | Get a list of all the years.            |
| [getMonths()](#getmonths)         | Get a list of all the months.           |



### getRegions()
Returns a list of all the regions of Ghent. The complete list of regions is shown below.

|                |                 |
|----------------|-----------------|
| **Parameters** | (none)          |
| **Returns**    | Array\<string\> |

| Complete list of regions.                                  |
|------------------------------------------------------------|
| Muide - Meulestede - Afrikalaan                            |
| Binnenstad                                                 |
| Bloemekenswijk                                             |
| Drongen                                                    |
| Elisabethbegijnhof - Prinsenhof - Papegaai - Sint-Michiels |
| Ledeberg                                                   |
| Mariakerke                                                 |
| Onbekend                                                   |
| Rabot - Blaisantvest                                       |
| Gentbrugge                                                 |
| Moscou - Vogelhoek                                         |
| Nieuw Gent - UZ                                            |
| Sint-Denijs-Westrem - Afsnee                               |
| Sluizeken - Tolhuis - Ham                                  |
| Watersportbaan - Ekkergem                                  |
| Gentse Kanaaldorpen en -zone                               |
| Sint-Amandsberg                                            |
| Stationsbuurt Zuid                                         |
| Brugse Poort - Rooigem                                     |
| Dampoort                                                   |
| Macharius - Heirnis                                        |
| Oostakker                                                  |
| Wondelgem                                                  |
| Stationsbuurt Noord                                        |
| Oud Gentbrugge                                             |
| Zwijnaarde                                                 |


### getCategories()
Returns a list of all the crime categories in the dataset. The complete list is shown below.

|                |                 |
|----------------|-----------------|
| **Parameters** | (none)          |
| **Returns**    | Array\<string\> |

| Complete list of regions.                 |
|-------------------------------------------|
| Diefstal gewapenderhand                   |
| Diefstal met geweld zonder wapen          |
| Geluidshinder                             |
| Sluikstorten                              |
| Woninginbraak                             |
| Zakkenrollerij                            |
| Fietsdiefstal                             |
| Motordiefstal                             |
| Parkeerovertredingen                      |
| Beschadiging aan auto                     |
| Diefstal uit of aan voertuigen            |
| Graffiti                                  |
| Inbraak in bedrijf of handelszaak         |
| Bromfietsdiefstal                         |
| Autodiefstal                              |
| Verkeersongevallen met lichamelijk letsel |

### getYears()
Returns a list of all the years in the dataset. The complete list is shown below.

|                |                 |
|----------------|-----------------|
| **Parameters** | (none)          |
| **Returns**    | Array\<number\> |

| Complete list of years. |
|-------------------------|
| 2018                    |
| 2019                    |
| 2020                    |
| 2021                    | 
| 2022                    |
| 2023                    |

### getMonths()
Returns a list of all the months in the dataset. The complete list is shown below.

|                |                 |
|----------------|-----------------|
| **Parameters** | (none)          |
| **Returns**    | Array\<string\> |

| Complete list of months. |
|--------------------------|
| januari                  |
| februari                 |
| maart                    |
| april                    | 
| mei                      |
| juni                     |
| juli                     |
 | augustus                 |
| september                |
| oktober                  |
| november                 |
| december                 |