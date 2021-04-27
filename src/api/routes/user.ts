import { Router } from "express";
import { Logger } from "winston";
import UserService from "../../service/user";

const route = Router();

export default (
  app: Router,
  userService: UserService,
  logger: Logger
): void => {
  app.use("/users", route);

  route.get("/", async (req, res, next) => {
    logger.info("GET /users");

    try {
      const users = await userService.ListUsers();
      res.status(200);
      res.setHeader("Content-Type", "application/json");
      return res.send(users);
    } catch (e) {
      logger.error(`Error requesting all users ${e}`);
      return next(e);
    }
  });

  route.put("/:user", async (req, res, next) => {
    const user = req.params.user;
    logger.info(`PUT /users/${user}`);

    try {
      await userService.AddUser(user);

      return res.status(200).send(`PUT /users/${user} successful`);
    } catch (e) {
      logger.error(`Error adding user ${user} ${e}`);
      return next(e);
    }
  });

  route.delete("/:user", async (req, res, next) => {
    const user = req.params.user;
    logger.info(`DELETE /users/${user}`);

    try {
      await userService.DeleteUser(user);

      return res.status(200).send(`DELETE /users/${user} successful`);
    } catch (e) {
      logger.error(`Error deleting user ${user} ${e}`);
      return next(e);
    }
  });
};
