import { Telegraf } from 'telegraf';
import { config } from 'dotenv';

config({ path: '.env' });

const userStore: {
    username: string;
    id: number;
}[] = [{
    username: process.env.OWNER_USERNAME as string,
    id: Number(process.env.OWNER_ID),
}];

const registerLog: number[] = [];

const bot = new Telegraf(process.env.API_TOKEN as string);

bot.start((ctx) => {
    ctx.reply('Lab operator active');
});

bot.launch().then(() => {
    console.log('Bot launch');
}).catch((err) => {
    console.log(err);
});

bot.command("register", (ctx) => {
    if (!registerLog.includes(ctx.message.from.id)) {
        ctx.reply("Asking Boss for access...");
        console.log("New register from id: " + ctx.message.from.id + " with username: " + ctx.message.from.username);
        registerLog.push(ctx.message.from.id);
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

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));