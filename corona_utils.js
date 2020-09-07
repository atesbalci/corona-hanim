const got = require('got');

let data = null;
let dateLastFetched = null;

const newDataAvailableListeners = [];
module.exports.newDataAvailableListeners = newDataAvailableListeners;

async function refreshData(callback) {
    try {
        const response = await got('https://raw.githubusercontent.com/ozanerturk/covid19-turkey-api/master/dataset/timeline.json');
        data = JSON.parse(response.body);
        const latest = getLatest();
        const latestDate = toDate(latest.date);
        if (dateLastFetched != null && dateLastFetched.getDay() != latestDate.getDay()) {
            newDataAvailableListeners.forEach(listener => {
                listener(latest);
            });
        }

        dateLastFetched = latestDate;
        callback();
    } catch (error) {
        console.log(error);
    }
}

function getLatest() {
    const today = todayFormatted();
    const yesterday = yesterdayFormatted();

    if (today in data) {
        return data[today];
    }
    
    return data[yesterday];
}

function dateFormatted(day, month, year) {
    const dayString = day.toString();
    const monthString = month.toString();
    const dayProcessed = dayString.length < 2 ? `0${dayString}` : dayString;
    const monthProcessed = monthString.length < 2 ? `0${monthString}` : monthString;
    return `${dayProcessed}/${monthProcessed}/${year}`;
}

function todayFormatted() {
    const date = new Date();
    return dateFormatted(date.getDay(), date.getMonth(), date.getFullYear());
}

function yesterdayFormatted() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return dateFormatted(date.getDay(), date.getMonth(), date.getFullYear());
}

function toDate(s) {
    var matches = s.match(/([0-9]{2})\/([0-9]{2})\/([0-9]{4})/);
    return new Date(parseInt(matches[3]), parseInt(matches[2]), parseInt(matches[1]));
}

function getDateCorona(dateFormatted, callback) {
    refreshData(() => {
        if (dateFormatted in data) {
            callback(data[dateFormatted]);
        }
    });
}

module.exports.getDateCorona = getDateCorona;

module.exports.getTodayCorona = function getTodayCorona(callback) {
    getDateCorona(todayFormatted(), callback);
}

module.exports.getYesterdayCorona = function getYesterdayCorona(callback) {
    getDateCorona(yesterdayFormatted(), callback);
}
