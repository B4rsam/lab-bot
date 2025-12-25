import type { TextMessageContext } from "src/props";
import dataStore from "src/store";

const handleStatus = (ctx: TextMessageContext) => {
    const { id } = ctx.message.from;

    if (dataStore.getUser(id)) {
        ctx.reply("You are registered.");
        return;
    }

    if (dataStore.getRegister(id)) {
        ctx.reply("Your request is pending.");
        return;
    }

    ctx.reply("You do not have access.");
    return;
};

export default handleStatus;
