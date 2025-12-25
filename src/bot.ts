import { Telegraf } from "telegraf";
import { config } from "dotenv";
import {handleGrant, handleRegister} from "src/handlers/auth/index";
import handleStatus from "./handlers/user/handleStatus.ts";
import { handleRequests, handleUsers } from "./handlers/user/index.ts";
import dataStore from "./store.ts";

config({ path: ".env" });

const bot = new Telegraf(process.env.API_TOKEN as string);

bot.start((ctx) => {
  ctx.reply("Lab operator active");
  if (ctx.message.from.id === Number(process.env.OWNER_ID)) {
    dataStore.setOwnerChat(ctx.chat.id);
  }
});

bot
  .launch(() => {
    console.log("Bot launch");
    dataStore.init();
  })
  .catch((err) => {
    console.log(err);
  });

bot.command("register", handleRegister);
bot.command("status", handleStatus);
bot.command("request", handleRequests)
bot.command("grant", handleGrant);
bot.command("list", handleUsers);

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
