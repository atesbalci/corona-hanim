const express = require('express');
const { prepareCoronaTelegramExpress } = require('./telegram_bot');
const app = express();

function startTelegramServer() {
    app.use(express.json());
    prepareCoronaTelegramExpress(app);
    app.listen(process.env.PORT || 80, () => console.log('Listening...'));
}

startTelegramServer();