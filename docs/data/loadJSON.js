import fs from 'fs/promises';

/**
 * Load a json file to an object.
 * @param path The path to the json file.
 * @returns The json object.
 */
async function loadJSON(path) {
  // errors that throw are fine. We want to be notified about them.
  const jsonData = await fs.readFile(path, 'utf-8');
  return JSON.parse(jsonData);
}
