import express from "express";
import routes from "../api";

export default ({ app }: { app: express.Express }): void => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(routes());

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
