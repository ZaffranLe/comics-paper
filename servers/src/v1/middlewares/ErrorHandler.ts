import * as express from "express";
import { MiddlewareError } from "../errors/MiddlewareError";

/**
 * Handler any incoming errors.
 */
export function ErrorHandler(
  err: MiddlewareError | Error,
  req: express.Request,
  res: express.Response,
  next: express.Next
) {
  let status = err instanceof MiddlewareError ? err.status : 500;

  // log out the middleware errors
  console.error(err);

  res.status(status).json({
    error: {
      message: err.message,
    },
  });

  // next(err);
}
