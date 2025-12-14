import { Telegraf } from "telegraf";
import { config } from "dotenv";
import db from "./database.ts";
import type { UserData } from "./props.ts";
import {handleGrant, handleRegister} from "src/handlers/auth/index";

config({ path: ".env" });

const userStore: Map<number, UserData> = new Map();
const registerStore: Map<number, UserData> = new Map();

const init = () => {
  const users = db.prepare(`SELECT * FROM users`);
  const registers = db.prepare(`SELECT * FROM register_log`);

  // @ts-ignore
  users.all().forEach((item) => userStore.set(item.user_id, item));
  // @ts-ignore
  registers.all().forEach((item) => registerStore.set(item.user_id, item));

  return;
};

const registerAdd = db.prepare(
    "INSERT INTO register_log(user_id, username) VALUES (?, ?) RETURNING *"
);
const userAdd = db.prepare(
    "INSERT INTO users(user_id, username) VALUES (?, ?) RETURNING *"
);

let ownerChatId: number = NaN;

const bot = new Telegraf(process.env.API_TOKEN as string);

bot.start((ctx) => {
  ctx.reply("Lab operator active");
  if (ctx.message.from.id === Number(process.env.OWNER_ID)) {
    ownerChatId = ctx.chat.id;
  }
});

bot
  .launch(() => {
    console.log("Bot launch");
    init();
  })
  .catch((err) => {
    console.log(err);
  });

bot.command("register", handleRegister);

bot.command("status", (ctx) => {
  const { id } = ctx.message.from;
  if (userStore.has(id)) {
    ctx.reply("Access granted");
  } else {
    ctx.reply("Access Denied");
  }
});

bot.hears("/requests", async (ctx) => {
  if (ctx.message.from.id === Number(process.env.OWNER_ID)) {
    let message = await "Request log:\n";
    await registerStore.forEach(
      (item, key) => (message += "\n" + key + ". " + item.username)
    );

    ctx.reply(message);
  }
});

bot.command("grant", handleGrant);

bot.command("list", async (ctx) => {
  if (ctx.message.from.id === Number(process.env.OWNER_ID)) {
    let message = "User list:\n";
    await userStore.forEach(
      (item, key) => (message += "\n" + key + ". " + item.username)
    );

    ctx.reply(message);
  }
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
