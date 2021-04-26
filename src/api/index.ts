import { Router } from "express";
import { Logger } from "winston";
import UserService from "../service/user";
import GistService from "../service/gist";
import user from "./routes/user";
import gist from "./routes/gist";

export default (
  userService: UserService,
  gistService: GistService,
  logger: Logger
): Router => {
  const app = Router();

  user(app, userService, logger);
  gist(app, gistService, logger);

  return app;
};
