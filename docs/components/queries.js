import {number} from "../.observablehq/cache/_npm/echarts@5.5.0/dist/echarts.esm.min.js";

/**
 *  Query object used for simplifying queries to the data.
 */
export class Query
{
    /**
     * Create a new query with the data.
     */
    constructor(data, final=false) {
        this.data = data;
        this._final = final;
    }

    /**
     * Group the data by region.
     */
    groupByRegion() {
        if (this._final)
            throw "QueryError: the query is already finalized, grouping should not be done anymore."
        let groupedObject = {};
        if (!Array.isArray(this.data)) {
            for (const [key, value] of Object.entries(this.data)) {
                groupedObject[key] = new Query(value).groupByRegion().data;
            }
        } else {
            for (const key of getRegions()) {
                groupedObject[key] = [];
            }
            for (const entry of this.data) {
                groupedObject[entry.region].push(entry);
            }
        }
        return new Query(groupedObject);
    }

    /**
     * Group the data by category.
     */
    groupByCategory() {
        if (this._final)
            throw "QueryError: the query is already finalized, grouping should not be done anymore."
        let groupedObject = {};
        if (!Array.isArray(this.data)) {
            for (const [key, value] of Object.entries(this.data)) {
                groupedObject[key] = new Query(value).groupByCategory().data;
            }
        } else {
            for (const key of getCategories()) {
                groupedObject[key] = [];
            }
            for (const entry of this.data) {
                groupedObject[entry.category].push(entry);
            }
        }
        return new Query(groupedObject);
    }

    /**
     * Group the data by year.
     */
    groupByYear() {
        if (this._final)
            throw "QueryError: the query is already finalized, grouping should not be done anymore."
        let groupedObject = {};
        if (!Array.isArray(this.data)) {
            for (const [key, value] of Object.entries(this.data)) {
                groupedObject[key] = new Query(value).groupByYear().data;
            }
        } else {
            for (const key of getYears()) {
                groupedObject[key] = [];
            }
            for (const entry of this.data) {
                groupedObject[entry.year].push(entry);
            }
        }
        return new Query(groupedObject);
    }

    /**
     * Group the data by month.
     */
    groupByMonth() {
        if (this._final)
            throw "QueryError: the query is already finalized, grouping should not be done anymore."
        let groupedObject = {};
        if (!Array.isArray(this.data)) {
            for (const [key, value] of Object.entries(this.data)) {
                groupedObject[key] = new Query(value).groupByMonth().data;
            }
        } else {
            for (const key of getMonths()) {
                groupedObject[key] = [];
            }
            for (const entry of this.data) {
                groupedObject[entry.month].push(entry);
            }
        }
        return new Query(groupedObject);
    }

    /**
     * Filter the query by region.
     */
    filterByRegion(region) {
        if (region === null) {
            return this;
        }
        if (this._final)
            throw "QueryError: the query is already finalized, can not filter the entries anymore."
        if (!Array.isArray(this.data)) {
            let returnedObject = {};
            for (const [key, value] of Object.entries(this.data)) {
                returnedObject[key] = new Query(value).filterByRegion(region).data;
            }
            return new Query(returnedObject);
        } else {
            return this.groupByRegion().select(region);
        }
    }

    /**
     * Filter the query by category.
     */
    filterByCategory(category) {
        if (category === null) {
            return this;
        }
        if (this._final)
            throw "QueryError: the query is already finalized, can not filter the entries anymore."
        if (!Array.isArray(this.data)) {
            let returnedObject = {};
            for (const [key, value] of Object.entries(this.data)) {
                returnedObject[key] = new Query(value).filterByCategory(category).data;
            }
            return new Query(returnedObject);
        } else {
            return this.groupByCategory().select(category);
        }
    }

    /**
     * Filter the query by year.
     */
    filterByYear(year) {
        if (year === null) {
            return this;
        }
        if (this._final)
            throw "QueryError: the query is already finalized, can not filter the entries anymore."
        if (!Array.isArray(this.data)) {
            let returnedObject = {};
            for (const [key, value] of Object.entries(this.data)) {
                returnedObject[key] = new Query(value).filterByYear(year).data;
            }
            return new Query(returnedObject);
        } else {
            return this.groupByYear().select(year);
        }
    }

    /**
     * Filter the query by month.
     */
    filterByMonth(month) {
        if (month === null) {
            return this;
        }
        if (this._final)
            throw "QueryError: the query is already finalized, can not filter the entries anymore."
        if (!Array.isArray(this.data)) {
            let returnedObject = {};
            for (const [key, value] of Object.entries(this.data)) {
                returnedObject[key] = new Query(value).filterByMonth(month).data;
            }
            return new Query(returnedObject);
        } else {
            return this.groupByMonth().select(month);
        }
    }

    /**
     * Filter the objects using the given filter function.
     */
    filterBy(filter_func) {
        if (filter_func === null) {
            return this;
        }
        if (this._final)
            throw "QueryError: the query is already finalized, can not filter the entries anymore."
        if (!Array.isArray(this.data)) {
            let returnedObject = {};
            for (const [key, value] of Object.entries(this.data)) {
                returnedObject[key] = new Query(value).filterBy(filter_func).data;
            }
            return new Query(returnedObject);
        } else {
            let new_data = this.data.filter(filter_func);
            return new Query(new_data);
        }
    }

    /**
     * Filter the result to only include the entries with the minimum total.
     */
    filterMin() {
        if (this._final)
            throw "QueryError: the query is already finalized, can not filter anymore."
        if (!Array.isArray(this.data)) {
            let returnedObject = {};
            for (const [key, value] of Object.entries(this.data)) {
                returnedObject[key] = new Query(value).filterMin().data;
            }
            return new Query(returnedObject);
        } else {
            let min = Infinity;
            let entries = [];
            for (const entry of this.data) {
                if (min > entry.total) {
                    entries = [];
                    min = entry.total;
                }
                if (min === entry.total) {
                    entries.push(entry);
                }
            }
            return new Query(entries);
        }
    }

    /**
     * Filter the result to only include the entries with the maximum total.
     */
    filterMax() {
        if (this._final)
            throw "QueryError: the query is already finalized, can not filter anymore."
        if (!Array.isArray(this.data)) {
            let returnedObject = {};
            for (const [key, value] of Object.entries(this.data)) {
                returnedObject[key] = new Query(value).filterMax().data;
            }
            return new Query(returnedObject);
        } else {
            let max = -Infinity;
            let entries = [];
            for (const entry of this.data) {
                if (max < entry.total) {
                    entries = [];
                    max = entry.total;
                }
                if (max === entry.total) {
                    entries.push(entry);
                }
            }
            return new Query(entries);
        }
    }

    /**
     * Calculate the total amount of crimes.
     */
    getTotal() {
        if (this._final)
            throw "QueryError: the query is already finalized, can not acquire total anymore."
        if (!Array.isArray(this.data)) {
            let returnedObject = {};
            for (const [key, value] of Object.entries(this.data)) {
                returnedObject[key] = new Query(value).getTotal().data;
            }
            return new Query(returnedObject, true);
        } else {
            let sum = 0;
            for (const entry of this.data) {
                sum += entry.total;
            }
            return new Query(sum, true);
        }
    }

    /**
     * Calculate the total amount of entries.
     */
    getCount() {
        if (this._final)
            throw "QueryError: the query is already finalized, can not acquire count anymore."
        if (!Array.isArray(this.data)) {
            let returnedObject = {};
            for (const [key, value] of Object.entries(this.data)) {
                returnedObject[key] = new Query(value).getCount().data;
            }
            return new Query(returnedObject, true);
        } else {
            let sum = 0;
            for (const _ of this.data) {
                sum += 1;
            }
            return new Query(sum, true);
        }
    }

    /**
     * Calculate the average amount of crimes.
     */
    getAverage() {
        if (this._final)
            throw "QueryError: the query is already finalized, can not acquire average anymore."
        if (!Array.isArray(this.data)) {
            let returnedObject = {};
            for (const [key, value] of Object.entries(this.data)) {
                returnedObject[key] = new Query(value).getAverage().data;
            }
            return new Query(returnedObject, true);
        } else {
            let sum = 0;
            let amount = 0;
            for (const entry of this.data) {
                sum += entry.total;
                amount += 1;
            }
            return new Query(sum/amount, true);
        }
    }

    /**
     * Split a grouped object in a key and value array.
     */
    split() {
        if (!Array.isArray(this.data)) {
            let returnedObject = {keys:[], values:[]};
            for (const [key, value] of Object.entries(this.data)) {
                returnedObject["keys"].push(key);
                returnedObject["values"].push(value);
            }
            return returnedObject;
        } else {
            throw "QueryError: cannot split a non-grouped query."
        }
    }

    /**
     * Acquire the result of the query.
     */
    result() {
        return this.data;
    }

    /**
     * Aggregate the outer group back into the query result.
     */
    aggregate(keyWhenNumber="key", combineFunction = (outerKey, innerKey) => `${outerKey} - ${innerKey}`) {
        if (!Array.isArray(this.data) && typeof this.data !== "number") {
            const first_entry = Object.entries(this.data)[0][1];
            if (typeof first_entry === "number") {
                let returnedObjects = [];
                for (const [key, total] of Object.entries(this.data)) {
                    let returnedObject = {};
                    returnedObject[keyWhenNumber] = key;
                    returnedObject["total"] = total;
                    returnedObjects.push(returnedObject);
                }
                return new Query(returnedObjects);
            }
            else if (Array.isArray(first_entry)) {
                let returnedObject = [];
                for (const [_, values] of Object.entries(this.data)) {
                    returnedObject.push(...values);
                }
                return new Query(returnedObject);
            } else {
                let returnedObject = {};
                for (const [outerKey, outerValue] of Object.entries(this.data)) {
                    for (const [innerKey, innerValue] of Object.entries(outerValue)) {
                        const key = combineFunction(outerKey, innerKey);
                        returnedObject[key] = innerValue;
                    }
                }
                return new Query(returnedObject, this._final);
            }
        } else {
            throw "QueryError: cannot aggregate a non-grouped query."
        }
    }

    /**
     * Select a single group from the different options in the map.
     */
    select(entry) {
        try {
            return new Query(this.data[entry]);
        } catch (e) {
            throw "QueryError: cannot select entry due to a wrong key or because this is a non-grouped query."
        }
    }

    /**
     * Select multiple groups from the different options in the map.
     */
    selectMultiple(entries) {
        try {
            let new_data = Object.assign({}, this.data);
            for (const key of Object.keys(this.data)) {
                if (entries.indexOf(key) === -1) {
                    delete new_data[key];
                }
            }
            return new Query(new_data);
        } catch (e) {
            throw "QueryError: cannot select entry due to a wrong key or because this is a non-grouped query."
        }
    }

    /**
     * Delete a single group from the different options in the map.
     */
    delete(entry) {
        try {
            let new_data = Object.assign({}, this.data);
            delete new_data[entry];
            return new Query(new_data);
        } catch (e) {
            throw "QueryError: cannot delete entry due to a wrong key or because this is a non-grouped query."
        }
    }

    /**
     * Delete multiple groups from the different options in the map.
     */
    deleteMultiple(entries) {
        try {
            let new_data = Object.assign({}, this.data);
            for (const entry of entries) {
                delete new_data[entry];
            }
            return new Query(new_data);
        } catch (e) {
            throw "QueryError: cannot delete entry due to a wrong key or because this is a non-grouped query."
        }
    }

}

/**
 * Get a list of all the regions of Ghent.
 */
export function getRegions() {
    return [
        "Muide - Meulestede - Afrikalaan",
        "Binnenstad",
        "Bloemekenswijk",
        "Drongen",
        "Elisabethbegijnhof - Prinsenhof - Papegaai - Sint-Michiels",
        "Ledeberg",
        "Mariakerke",
        "Onbekend",
        "Rabot - Blaisantvest",
        "Gentbrugge",
        "Moscou - Vogelhoek",
        "Nieuw Gent - UZ",
        "Sint-Denijs-Westrem - Afsnee",
        "Sluizeken - Tolhuis - Ham",
        "Watersportbaan - Ekkergem",
        "Gentse Kanaaldorpen en -zone",
        "Sint-Amandsberg",
        "Stationsbuurt Zuid",
        "Brugse Poort - Rooigem",
        "Dampoort",
        "Macharius - Heirnis",
        "Oostakker",
        "Wondelgem",
        "Stationsbuurt Noord",
        "Oud Gentbrugge",
        "Zwijnaarde",
    ]
}

/**
 * Get a list of all the crime categories.
 */
export function getCategories() {
   return [
       "Diefstal gewapenderhand",
       "Diefstal met geweld zonder wapen",
       "Geluidshinder",
       "Sluikstorten",
       "Woninginbraak",
       "Zakkenrollerij",
       "Verkeerongevallen met lichamelijk letsel",
       "Fietsdiefstal",
       "Motordiefstal",
       "Parkeerovertredingen",
       "Beschadiging aan auto",
       "Diefstal uit of aan voertuigen",
       "Graffiti",
       "Inbraak in bedrijf of handelszaak",
       "Bromfietsdiefstal",
       "Autodiefstal",
       "Verkeersongevallen met lichamelijk letsel"
   ]
}

/**
 * Get a list of all the years.
 */
export function getYears() {
    return [
        2018,
        2019,
        2020,
        2021,
        2022,
        2023
    ]
}

/**
 * Get a list of all the months.
 */
export function getMonths() {
    return [
        "januari",
        "februari",
        "maart",
        "april",
        "mei",
        "juni",
        "juli",
        "augustus",
        "september",
        "oktober",
        "november",
        "december"
    ]
}
