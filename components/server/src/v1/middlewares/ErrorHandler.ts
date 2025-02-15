import * as express from 'express';
import { MiddlewareError } from '../errors/MiddlewareError';
import { Locale } from '../Locale';

/**
 * Handler any incoming errors.
 */
export function ErrorHandler(
  err: MiddlewareError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  if (res.headersSent) {
    return next(err);
  }

  // log out the middleware errors
  console.error(err);
  const responseStatus = err.status || 500;
  res.status(responseStatus).json({
    error: {
      message:
        responseStatus === 500
          ? Locale.HttpResponseMessage.InternalServerError
          : err.message,
    },
  });

  // next(err);
}
