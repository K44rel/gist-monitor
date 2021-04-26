import Logger from "./logger";
import { RedisClient } from "redis";

export default ({ redis }: { redis: RedisClient }): RedisClient => {
  redis.on("error", function (error) {
    Logger.error(error);
  });

  return redis;
};
