import config from "./config";
import express from "express";
import Logger from "./loaders/logger";
import initialize from "./loaders";
import redis from "redis";

async function serve() {
  const app = express();
  const redisInstance = redis.createClient({
    host: config.redis.host,
    port: config.redis.port,
  });

  await initialize({ expressApp: app, redis: redisInstance });

  app
    .listen(config.port, () => {
      Logger.info(`Server started on port ${config.port}`);
    })
    .on("error", (err) => {
      Logger.error(err);
      process.exit(1);
    });
}

serve();
