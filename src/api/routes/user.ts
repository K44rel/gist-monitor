import { Router } from "express";
const route = Router();

export default (app: Router): void => {
  app.use("/users", route);

  route.put("/:user", (req, res) => {
    new Error(`todo ${req}, ${res}`);
  });

  route.delete("/:user", (req, res) => {
    new Error(`todo ${req}, ${res}`);
  });

  route.get("/", (req, res) => {
    res.status(200);
    res.send("OK");
  });
};
