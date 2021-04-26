import { Router } from "express";
import { Logger } from "winston";
import UserService from "../service/user";
import user from "./routes/user";

export default (userService: UserService, logger: Logger): Router => {
  const app = Router();

  user(app, userService, logger);

  return app;
};
