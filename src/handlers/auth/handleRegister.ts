import type { TextMessageContext } from "src/props";
import dataStore from "src/store";

const handleRegister = (ctx: TextMessageContext) => {
    const { id, username } = ctx.message.from;

    if (dataStore.getRegister(id)) return;

    if (dataStore.getUser(id)) {
        ctx.reply("You are already registered.");
        return;
    }

    if (!username) {
        ctx.reply("Please set a valid username.");
        return;
    }

    dataStore.addRegister({ id, username });
    ctx.reply("Asking Boss for access...");

    return;
};

export default handleRegister;
