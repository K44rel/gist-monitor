import ExpressInstance from "./express";
import RedisInstance from "./redis";
import { Express } from "express";
import { RedisClient } from "redis";
import UserRepository from "../repository/user";
import UserService from "../service/user";
import LoggerInstance from "./logger";
import GistService from "../service/gist";
import GistRepository from "../repository/gist";
import GithubService from "../service/github";
import config from "../config";
import cron from "node-cron";

export default async ({
  expressApp,
  redis,
}: {
  expressApp: Express;
  redis: RedisClient;
}): Promise<void> => {
  LoggerInstance.info("Startup process initiated");

  const redisClient = RedisInstance({ redis: redis, logger: LoggerInstance });
  LoggerInstance.info("Redis loaded");

  const userRepository = new UserRepository(redisClient, LoggerInstance);
  const gistRepository = new GistRepository(redisClient, LoggerInstance);

  const githubService = new GithubService(LoggerInstance);
  const userService = new UserService(userRepository, LoggerInstance);
  const gistService = new GistService(
    userRepository,
    gistRepository,
    githubService,
    LoggerInstance
  );
  LoggerInstance.info("Dependencies injected");

  await ExpressInstance({
    app: expressApp,
    userService,
    gistService,
    logger: LoggerInstance,
  });
  LoggerInstance.info("Express loaded");

  cron.schedule(config.cron, async function () {
    LoggerInstance.info("Starting periodic update");
    await gistService.UpdateGists();
    LoggerInstance.info("Periodic update complete");
  });
  LoggerInstance.info(`Periodic gist updater started with cron ${config.cron}`);

  LoggerInstance.info("Startup process completed");
};
