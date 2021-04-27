import express from "express";
import { Logger } from "winston";
import routes from "../api";
import GistService from "../service/gist";
import UserService from "../service/user";

export default ({
  app,
  userService,
  gistService,
  logger,
}: {
  app: express.Express;
  userService: UserService;
  gistService: GistService;
  logger: Logger;
}): void => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(routes(userService, gistService, logger));
  app.set("json spaces", 2);

  app.use((req, res, next) => {
    const err = new Error("Not Found");
    err["status"] = 404;
    next(err);
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
