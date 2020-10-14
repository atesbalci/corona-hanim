const https = require('https');
const { getTodayCorona, getYesterdayCorona, newDataAvailableListeners, getDateCorona, refreshData } = require('./corona_utils');

function handleCoronaTelegram(req, res) {    
    try {
        let chatId = req.body.message.chat.id;
        let command = req.body.message.text;
        let match;

        console.log(chatId);
        if (command.includes('/buguncorona')) {
            getTodayCorona(data => sendData(data, chatId));
        } else if (command.includes('/duncorona')) {
            getYesterdayCorona(data => sendData(data, chatId));
        } else if ((match = command.match(/\/oguncorona ([0-9]{2}\/[0-9]{2}\/[0-9]{4})/))) {
            getDateCorona(match[1], data => sendData(data, chatId));
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports.handleCoronaTelegram = handleCoronaTelegram;
module.exports.initCoronaTelegram = function initCoronaTelegram() {
    newDataAvailableListeners.push(onNewData);
    setInterval(() => refreshData(null), 300000);
}
  
function sendMessage(chatId, message) {
    https.get(`${process.env.CORONA_TELEGRAM_SEND_URL_PREFIX}chat_id=${chatId}&text=${message}`);
}

function onNewData(data) {
    sendData(data, process.env.CORONA_TELEGRAM_GROUP_ID);
}

function sendData(data, chatId) {
    sendMessage(chatId, `Tarih:+${data.date}%0aYeni+'Hasta':+${data.cases}%0aTest:+${data.tests}%0aOlum:+${data.deaths}%0aIyilesen:+${data.recovered}`);
}
