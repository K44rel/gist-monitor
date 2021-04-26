import express from "express";
import { Logger } from "winston";
import routes from "../api";
import UserService from "../service/user";

export default ({
  app,
  userService,
  logger,
}: {
  app: express.Express;
  userService: UserService;
  logger: Logger;
}): void => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(routes(userService, logger));

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
