import type {TextMessageContext} from "src/props";
import { config } from "dotenv";
import * as process from "node:process";
import dataStore from "src/store";

const { getRegister, addUser } = dataStore;

config({ path: ".env" });

const handleGrant = (ctx: TextMessageContext) => {
    if (ctx.message.from.id !== Number(process.env.OWNER_ID)) return;

    // @ts-ignore
    const index: number | undefined = ctx.payload;

    if (index === undefined || !getRegister(index)) {
        ctx.reply("Invalid ID");
        return;
    }

    const data = getRegister(index);

    addUser(data);
    ctx.reply("User added!");
    return;
};

export default handleGrant;
