// fetch the data
let allData = [];
for(let year = 2018; year < 2024; year++){
  let to_fetch = Infinity;
  let offset = 0;
  while (to_fetch >= offset)
  {
    const res = await fetch(`https://data.stad.gent/api/explore/v2.1/catalog/datasets/criminaliteitscijfers-per-wijk-per-maand-gent-${year}/records?limit=100&offset=${offset}`);
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
    const result = await res.json();
    if (to_fetch === Infinity)
    {
      to_fetch = result.total_count;
    }
    result.results.forEach(item => {
      allData.push(item);
    });
    offset += 100;
  }
}

let organised_data = {};
allData.forEach(item =>{
  let quarter = item.quarter;
  // store geometry and init categories
  if(!(quarter in organised_data)){
    organised_data[quarter] = {
      geometry: item.geometry,
      categories: {}
    };
  }

  let category = item.fact_category;
  if(!(category in organised_data[quarter].categories)){
    organised_data[quarter].categories[category] = [];
  }

  // store the data
  organised_data[quarter].categories[category].push({
    year: item.year,
    month: item.month,
    total: item.total,
    geo_point_2d: item.geo_point_2d
  });
});

process.stdout.write(JSON.stringify(organised_data));
