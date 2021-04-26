import config from "./config";
import express from "express";
import Logger from "./loaders/logger";
import initialize from "./loaders";

async function serve() {
  const app = express();

  await initialize({ expressApp: app });

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
