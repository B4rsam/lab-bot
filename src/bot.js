"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var telegraf_1 = require("telegraf");
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: '.env' });
var userStore = [{
        username: process.env.OWNER_USERNAME,
        id: Number(process.env.OWNER_ID),
    }];
var registerLog = [];
var bot = new telegraf_1.Telegraf(process.env.API_TOKEN);
bot.start(function (ctx) {
    ctx.reply('Lab operator active');
});
bot.launch().then(function () {
    console.log('Bot launch');
}).catch(function (err) {
    console.log(err);
});
bot.command("register", function (ctx) {
    if (!registerLog.includes(ctx.message.from.id)) {
        ctx.reply("Asking Boss for access...");
        console.log("New register from id: " + ctx.message.from.id + " with username: " + ctx.message.from.username);
        registerLog.push(ctx.message.from.id);
    }
});
bot.command("status", function (ctx) {
    var _a = ctx.message.from, id = _a.id, username = _a.username;
    if (!!userStore.find(function (user) { return user.id === id && user.username === username; })) {
        ctx.reply("Access granted");
    }
    else {
        ctx.reply("Access Denied");
    }
});
process.once('SIGINT', function () { return bot.stop('SIGINT'); });
process.once('SIGTERM', function () { return bot.stop('SIGTERM'); });
