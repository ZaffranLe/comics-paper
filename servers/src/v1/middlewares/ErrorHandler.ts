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
  if (res.headersSent) {
    return next(err);
  }

  // log out the middleware errors
  console.error(err);

  res.status(err.status || 500).json({
    error: {
      message: err.message,
    },
  });

  // next(err);
}
