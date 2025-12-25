import type { TextMessageContext } from "src/props";
import dataStore from "src/store";

const handleUsers = (ctx: TextMessageContext) => {
    const { id } = ctx.message.from;

    if (!dataStore.isOwner(id)) return;

    let list = "Users list:\n";

    dataStore.getAllUsers().forEach(([uid, item]) => {
        list += "\n" + uid + "." + " " + item.username;
    });

    ctx.reply(list);
};

export default handleUsers;
