import type { TextMessageContext } from "src/props";
import dataStore from "src/store";

const handleRequest = (ctx: TextMessageContext) => {
    const { id } = ctx.message.from;

    if (!dataStore.isOwner(id)) return;

    let list = "Register list:\n";

    dataStore.getAllRegisters().forEach(([uid, item]) => {
        list += "\n" + uid + "." + " " + item.username;
    });

    ctx.reply(list);

    return;
};

export default handleRequest;
