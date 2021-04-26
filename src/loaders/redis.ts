import { RedisClient } from "redis";
import { Logger } from "winston";

export default ({
  redis,
  logger,
}: {
  redis: RedisClient;
  logger: Logger;
}): RedisClient => {
  redis.on("error", function (error) {
    logger.error(error);
  });

  return redis;
};
