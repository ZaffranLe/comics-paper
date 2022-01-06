import * as express from "express";
import { MiddlewareError } from "../errors/MiddlewareError";

/**
 * Handler any incoming errors.
 */
export function ErrorHandler(
  err: MiddlewareError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // let status = err instanceof MiddlewareError ? err.status : 500;
  // console.log(err, status);
  // log out the middleware errors
  console.error(err);

  res.status(err.status || 500).json({
    error: {
      message: err.message,
    },
  });

  // next(err);
}
