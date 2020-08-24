var generateDate = () => {
    var rdMonth = 1+Math.ceil(Math.random() * 12);
    var rdDay = 0;
    switch (rdMonth) {
        case 1, 3, 5, 7, 8, 10, 12: rdDay = 1 + Math.ceil(Math.random() * 30)
        case 4, 6, 9, 11: rdDay = 1 + Math.ceil(Math.random() * 29)
        case 2: rdDay = 1 + Math.ceil(Math.random() * 28)
    }
    return new Date((new Date()).getFullYear(), rdMonth, rdDay)
}

module.exports = {
    generateDate: generateDate
}