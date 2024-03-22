// fetch the data
let allData = [];
for(let year = 2018; year < 2024; year++){
  const res = await fetch(`https://data.stad.gent/api/explore/v2.1/catalog/datasets/criminaliteitscijfers-per-wijk-per-maand-gent-${year}/records`);
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  const data = await res.json();
  data.results.forEach(item => {
    allData.push(item);
  });
}

let organised_data = {};
allData.forEach(item =>{
  let quarter = item.quarter;
  // store geometry and init categorys
  if(!(quarter in organised_data)){
    organised_data[quarter] = {
      geometry: item.geometry,
      categorys: {}
    };
  }

  let category = item.fact_category
  if(!(category in organised_data[quarter].categorys)){
    organised_data[quarter].categorys[category] = [];
  }

  // store the data
  organised_data[quarter].categorys[category].push({
    year: item.year,
    month: item.month,
    total: item.total,
    geo_point_2d: item.geo_point_2d
  });
});

process.stdout.write(JSON.stringify(organised_data));
