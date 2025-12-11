import { Telegraf } from "telegraf";
import { config } from "dotenv";
import db from "./database.ts";
import type { UserData } from "./props.ts";

config({ path: ".env" });

const userStore: Map<number, UserData> = new Map();
const registerStore: Map<number, UserData> = new Map();

const registerAdd = db.prepare(
  "INSERT INTO register_log(user_id, username) VALUES (@user_id, @username) RETURNING *"
);
const userAdd = db.prepare(
  "INSERT INTO users(user_id, username) VALUES (@user_id, @username) RETURNING *"
);

const init = () => {
  const users = db.prepare<UserData[]>(`SELECT * FROM users`);
  const registers = db.prepare<UserData[]>(`SELECT * FROM register_log`);

  // @ts-ignore
  users.all().forEach((item) => userStore.set(item.user_id, item));
  // @ts-ignore
  registers.all().forEach((item) => registerStore.set(item.user_id, item));

  return;
};

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

bot.command("register", (ctx) => {
  if (!registerStore.has(ctx.message.from.id)) {
    if (userStore.has(ctx.message.from.id)) {
      ctx.reply("You are already registered.");
      return;
    }

    const message =
      "New register from id: " +
      ctx.message.from.id +
      " with username: " +
      ctx.message.from.username;

    ctx.reply("Asking Boss for access...");
    console.log(message);

    registerAdd.run(ctx.message.from.id, ctx.message.from.username);
    registerStore.set(ctx.message.from.id, {
      user_id: ctx.message.from.id,
      username: ctx.message.from.username,
    });

    ctx.telegram.sendMessage(ownerChatId, message);
  }
});

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

bot.command("grant", (ctx) => {
  if (ctx.message.from.id === Number(process.env.OWNER_ID)) {
    const index = ctx.payload;

    if (index === undefined || isNaN(Number(index))) {
      ctx.reply("Invalid index");
    }

    const data = registerStore.get(Number(index));

    if (!data) {
      ctx.reply("Invalid index");
      return;
    }

    userAdd.run(data.user_id, data.username);
    userStore.set(data.user_id, data);

    ctx.reply(
      "Granting access to user " + registerStore.get(Number(data.user_id))
    );
  }
});

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
