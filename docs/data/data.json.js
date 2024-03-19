// fetch the data
let allData = [];
for(let year = 18; year < 24; year++){
  const res = await fetch(`https://data.stad.gent/api/explore/v2.1/catalog/datasets/criminaliteitscijfers-per-wijk-per-maand-gent-${year}/records`);
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  const data = res.json();
  data.results.forEach(item => {
    allData.push(item);
  });
}

// extract the geometry data
let geometry = {};
allData.forEach(item =>{
  let quarter = item.quarter;
  if(!(quarter in geometry)){
    geometry[quarter] = item.geometry;
  }
});

// get data per quarter
