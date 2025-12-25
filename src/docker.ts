import { Api } from "@locktech/docker-client";
import * as process from "node:process";
import { config } from "dotenv";

config({ path: ".env" });

const docker = new Api({
  baseURL: process.env.DOCKER_URL,
  socketPath: "/var/run/docker.sock",
});

const useDocker = () => {
  const getContainerState = async (id: string) => {
    const {
      data: { State },
    } = await docker.containers.containerInspect(id);
    if (!State) return;

    return {
      status: State.Status,
      startDate: State.StartedAt,
      finishDate: State.FinishedAt,
    };
  };

  const containerAction = async (
    id: string,
    action: "start" | "stop" | "restart"
  ) => {
    switch (action) {
      case "start":
        return await docker.containers.containerStart(id);
      case "stop":
        return await docker.containers.containerStop(id);
      case "restart":
        return await docker.containers.containerRestart(id);
      default:
        throw new Error("Invalid action: " + action);
    }
  };

  return {
    getContainerState,
    containerAction,
  };
};

export default useDocker;
