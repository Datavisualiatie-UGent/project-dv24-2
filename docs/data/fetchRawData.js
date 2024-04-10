/**
 * Get all the rows of all the datasets from the Gent API.
 * @returns The raw crime data as a list of JSON objects as provided by the API.
 */
export async function fetchRawData() {
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
}

