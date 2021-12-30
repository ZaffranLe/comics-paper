import { express } from "express";
/**
 * Handler any incoming errors.
 */
export async function ErrorHandler(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
  err: Error
) {
  const status = 500;
  const message = err.message || "Internal server error";
  res.status(status).json({
    error: message,
  });
}
