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
        this.final = final;
    }

    /**
     * Group the data by year.
     */
    groupByYear() {
        if (this.final)
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
        if (this.final)
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
     * Group the data by category.
     */
    groupByCategory() {
        if (this.final)
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
     * Group the data by region.
     */
    groupByRegion() {
        if (this.final)
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
     * Calculate the total amount of crimes.
     */
    getTotal() {
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
     * Calculate the average amount of crimes.
     */
    getAverage() {
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
