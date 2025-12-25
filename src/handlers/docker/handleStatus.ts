import useDocker from "src/docker";
import type { TextMessageContext } from "src/props";
import dataStore from "src/store";

const handleStatus = async (ctx: TextMessageContext) => {
    const { id } = ctx.message.from;

    // @ts-ignore
    const name: string | undefined = ctx.payload;

    if (!dataStore.getUser(id)) return;

    if (!name || name.toLowerCase() !== "gtnh") {
        ctx.reply("Invalid container name");
        return;
    }

    const { getContainerState } = useDocker();

    const state = await getContainerState(name);
    const hasStart = state?.status === "created" || state?.status === "running";

    ctx.reply(
        "Status: " + state?.status + "\n" +
        hasStart ?
            "Started at: " + state?.startDate + "\n" :
            "Finished at: " + state?.finishDate
    );
    return;
};

export default handleStatus;
