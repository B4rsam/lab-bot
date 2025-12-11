import { Telegraf } from 'telegraf';
import { config } from 'dotenv';

interface userData {
    username?: string;
    id: number;
}

config({ path: '.env' });

const userStore: userData[] = [{
    username: process.env.OWNER_USERNAME as string,
    id: Number(process.env.OWNER_ID),
}];

const registerLog: userData[] = [];

let ownerChatId: number = NaN;

const bot = new Telegraf(process.env.API_TOKEN as string);

bot.start((ctx) => {
    ctx.reply('Lab operator active');
    if (ctx.message.from.id === Number(process.env.OWNER_ID)) {
        ownerChatId = ctx.chat.id;
    }
});

bot.launch().then(() => {
    console.log('Bot launch');
}).catch((err) => {
    console.log(err);
});

bot.command("register", (ctx) => {
    if (userStore.find((user) => user.id === ctx.message.from.id && user.username === ctx.message.from.username)) {
        ctx.reply("You are already registered.");
    } else if (!registerLog.find((log) => log.id === ctx.message.from.id )) {
        const message = "New register from id: " + ctx.message.from.id + " with username: " + ctx.message.from.username;

        ctx.reply("Asking Boss for access...");
        console.log(message);
        registerLog.push({ id: ctx.message.from.id, username: ctx.message.from.username });

        ctx.telegram.sendMessage(ownerChatId, message);
    }
});

bot.command("status", (ctx) => {
    const { id, username } = ctx.message.from
    if (!!userStore.find((user) => user.id === id && user.username === username)) {
        ctx.reply("Access granted");
    } else {
        ctx.reply("Access Denied");
    }
});

bot.hears("/requests", async (ctx) => {
    if (ctx.message.from.id === Number(process.env.OWNER_ID)) {
        const message = await "Request log:\n" + registerLog.map((item, index) => "\n" + index + ". Request by id: " + item.id + " with username: " + item.username);
        ctx.reply(message);
    }
});

bot.command("grant", (ctx) => {
    if (ctx.message.from.id === Number(process.env.OWNER_ID)) {
        const index = ctx.payload;

        if (index === undefined || isNaN(Number(index))) {
            ctx.reply("Invalid index");
        }

        if (!registerLog[Number(index)]) {
            ctx.reply("Invalid index");
        }

        userStore.push(registerLog[Number(index)] as userData);
        ctx.reply("Granting access to user " + registerLog[Number(index)]?.username);
    }
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));