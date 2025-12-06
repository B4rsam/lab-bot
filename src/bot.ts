import { Telegraf } from 'telegraf';
import { config } from 'dotenv';

config({ path: '.env' })

const bot = new Telegraf(process.env.API_TOKEN as string);

bot.start((ctx) => {
    ctx.reply('Hello World!');
});

bot.launch().then(() => {
    console.log('Bot launch');
}).catch((err) => {
    console.log(err);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));