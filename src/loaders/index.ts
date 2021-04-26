import expressInstance from "./express";
import redisInstance from "./redis";
import { Express } from "express";
import { RedisClient } from "redis";
import UserRepository from "../repository/user";
import UserService from "../service/user";
import LoggerInstance from "./logger";

export default async ({
  expressApp,
  redis,
}: {
  expressApp: Express;
  redis: RedisClient;
}): Promise<void> => {
  LoggerInstance.info("Startup process initiated");

  const redisClient = redisInstance({ redis: redis });
  LoggerInstance.info("Redis loaded");

  const userModel = new UserRepository(redisClient, LoggerInstance);
  const userService = new UserService(userModel, LoggerInstance);

  await expressInstance({
    app: expressApp,
    userService,
    logger: LoggerInstance,
  });
  LoggerInstance.info("Express loaded");

  LoggerInstance.info("Startup process completed");
};
