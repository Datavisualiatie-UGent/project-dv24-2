export function getRegions(data) {
   return Object.keys(data);
}

export function getCategorys(data) {
  const regions = getRegions(data);
  return Object.keys(data[regions[0]].categorys);
}
