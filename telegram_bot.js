const { Telegraf } = require('telegraf');
const { getTodayCorona, getYesterdayCorona, newDataAvailableListeners, getDateCorona, refreshData } = require('./corona_utils');

let bot;

module.exports.startCoronaTelegramBot = function(botToken) {
    bot = new Telegraf(botToken);
    newDataAvailableListeners.push(onNewData);
    setInterval(() => refreshData(null), 300000);
    bot.on('text', onText);
    bot.launch();
}

function onText(ctx) {
    try {
        let chatId = ctx.message.chat.id;
        let command = ctx.message.text;
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
  
function sendMessage(chatId, message) {
    bot.telegram.sendMessage(chatId, message);
}

function onNewData(data) {
    sendData(data, process.env.CORONA_TELEGRAM_GROUP_ID);
}

function sendData(data, chatId) {
    sendMessage(chatId, `Tarih: ${data.date}\nYeni Vaka: ${data.cases}\nTest: ${data.tests}\nOlum: ${data.deaths}\nIyilesen: ${data.recovered}`);
}
