"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var telegraf_1 = require("telegraf");
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: '.env' });
var bot = new telegraf_1.Telegraf(process.env.API_TOKEN);
bot.start(function (ctx) {
    ctx.reply('Hello World!');
});
bot.launch().then(function () {
    console.log('Bot launch');
}).catch(function (err) {
    console.log(err);
});
process.once('SIGINT', function () { return bot.stop('SIGINT'); });
process.once('SIGTERM', function () { return bot.stop('SIGTERM'); });
