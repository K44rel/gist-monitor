import { Router } from "express";
import { Logger } from "winston";
import GistService from "../../service/gist";

const route = Router();

export default (
  app: Router,
  gistService: GistService,
  logger: Logger
): void => {
  app.use("/gist", route);

  route.get("/", async (req, res, next) => {
    logger.info("GET /gist");

    try {
      await gistService.UpdateGists();

      return res.status(200).send("Gists updated");
    } catch (e) {
      logger.error(`Error updating gists ${e}`);
      return next(e);
    }
  });

  route.get("/:user", async (req, res, next) => {
    const user = req.params.user;
    logger.info(`GET /gist/${user}`);

    try {
      const recent = await gistService.GetRecent(user);

      return res.status(200).json(recent);
    } catch (e) {
      logger.error(`Error requesting recent gists for user ${user} ${e}`);
      return next(e);
    }
  });
};
