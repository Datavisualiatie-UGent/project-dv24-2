import {getRegions} from "./queries.js";

/**
 * Get a list of all crime categories
 */
export function getCategories(data) {
    let categories = [];
    for (const region of getRegions(data)) {
        const newCategories = data?.[region];
        if (newCategories) {
            for (const category of Object.keys(newCategories)) {
                if (!categories.includes(category)) {
                    categories.push(category);
                }
            }
        }
    }
    return categories;
}

/**
 * Get a list of crime amounts per category.
 * This list is ordered by the output of getCategories.
 */
export function getAmountsPerCategory(data) {
    const amounts = [];
    for (const category of getCategories(data)) {
        let amount = 0;
        for (const region of getRegions(data)) {
            const nums = data?.[region]?.[category];
            if (nums) {
                for (const num of nums) {
                    amount += num.total;
                }
            }
        }
        amounts.push(amount);
    }
    return amounts;
}


/**
 * Get a list of crime amounts per year.
 * This list is ordered by year.
 */
export function getAmountsPerYear(data, years) {
    const amounts = [];
    for (const year of years) {
        let amount = 0;
        for (const region of getRegions(data)) {
            for (const category of getCategories(data)) {
                const nums = data?.[region]?.[category];
                if (nums) {
                    for (const num of nums) {
                        if (parseInt(num.year) === year) {
                            amount += num.total;
                        }
                    }
                }
            }
        }
        amounts.push(amount);
    }
    return amounts;
}
