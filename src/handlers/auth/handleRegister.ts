import type { TextMessageContext } from "src/props";
import dataStore from "src/store";

const handleRegister = (ctx: TextMessageContext) => {
    const { id, username } = ctx.message.from;
    const { getRegister, getUser, addRegister } = dataStore;

    if (getRegister(id)) return;

    if (getUser(id)) {
        ctx.reply("You are already registered.");
        return;
    }

    if (!username) {
        ctx.reply("Please set a valid username.");
        return;
    }

    addRegister({ id, username });
    ctx.reply("Asking Boss for access...");

    return;
};

export default handleRegister;
