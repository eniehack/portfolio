export const now = function () {
    return (new Date()).toISOString();
};

export const newDate = function (str) {
    return new Date(str);
};

const sortUpdates = function (arr) {
    return arr.sort((obja, objb) => {
        const a = new Date(obja["updated"])
        console.log(a.getTime())
        const b = new Date(objb["updated"])
        return a.getTime() - b.getTime();
    })
};

const reverseUpdates = function (arr) {
    return arr.reverse()
};

export const date = function () {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${date.getFullYear()}-${month.toString().length !== 2 ? "0"+month.toString() : month.toString() }-${day.toString().length !== 2 ? "0"+day.toString() : day.toString() }`
};

const filter = {newDate, sortUpdates, reverseUpdates}
const shortCode = {date, now}

export {
    filter,
    shortCode,
}