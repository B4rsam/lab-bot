import useDocker from "src/docker";
import type { TextMessageContext } from "src/props";
import dataStore from "src/store";

const handleAction = (ctx: TextMessageContext) => {
    const { id } = ctx.message.from;

    if (!dataStore.getUser(id)) return;

    // @ts-ignore
    const payload = ctx.payload as string | undefined;

    if (!payload) {
        ctx.reply("Invalid action");
        return;
    }

    const parsedPayload = payload?.split(" ");

    const name = parsedPayload[0];
    const action = parsedPayload[1];

    if (name?.toLowerCase() !== "gtnh" || action !== "start" && action !== "stop") {
        ctx.reply("Invalid Name or Action");
        return;
    }

    const { containerAction } = useDocker();

    containerAction(name, action).then((res) => {
        console.log(res);
        ctx.reply(JSON.stringify(res));

    }).catch((err) => {
        console.log(err);
        ctx.reply(JSON.stringify(err));
    });
    return;
};

export default handleAction;
