import {getRegions} from "./querys.js";

export function getCategories(data) {
    let categories = [];
    for (const region of getRegions(data)) {
        const newCategories = data?.[region]?.["categories"];
        if (newCategories) {
            for (const categorie of Object.keys(newCategories)) {
                if (!categories.includes(categorie)) {
                    categories.push(categorie);
                }
            }
        }
    }
    return categories;
}

export function getAmountsPerCategory(data) {
    const amounts = [];
    for (const categorie of getCategories(data)) {
        let amount = 0;
        for (const region of getRegions(data)) {
            const nums = data?.[region]?.["categories"]?.[categorie];
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

export function getAmountsPerYear(data, years) {
    const amounts = [];
    for (const year of years) {
        let amount = 0;
        for (const region of getRegions(data)) {
            for (const categorie of getCategories(data)) {
                const nums = data?.[region]?.["categories"]?.[categorie];
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