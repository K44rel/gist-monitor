import expressLoader from "./express";
import { Express } from "express";
import Logger from "./logger";

export default async ({
  expressApp,
}: {
  expressApp: Express;
}): Promise<void> => {
  Logger.info("Startup process initiated");

  await expressLoader({ app: expressApp });
  Logger.info("Express loaded");

  Logger.info("Startup process completed");
};
