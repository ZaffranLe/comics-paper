import { ComicInterface } from "./../interfaces/ComicInterface";
import { PermissionEnum } from "./../interfaces/PermissionInterface";
import { MiddlewareError } from "./../errors/MiddlewareError";
import { Locale } from "./../Locale";
import express from "express";
import { User } from "../classes/User";
import { getAuth } from "../middlewares/AuthMiddleware";
import ComicController from "../controllers/ComicController";
const router = express.Router();

/**
 * Create a new comic.
 */
router.post("/", getAuth, async (req, res, next) => {
  const user: User = req["UserRequest"];

  // Authorization required
  if (!user) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401)
    );
  }

  // Check permissions
  if (!user.hasPermission(PermissionEnum.COMIC_CREATE)) {
    return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
  }

  // Extract content from body
  const { name, description } = req.body;

  try {
    // Try to create comic
    const comic: ComicInterface = await ComicController.createComic(
      name,
      description,
      user.id
    );

    // Send response
    res.status(201).json({
      comic,
    });
  } catch (err) {
    return next(new MiddlewareError(err.message, 500));
  }
});

/**
 * Get a comic by id
 */
router.get(`/:id`, async (req, res, next) => {
  const comicId: string = req.params.id;
  try {
    const comic: ComicInterface = await ComicController.getComic(comicId);
    // not found
    if (!comic) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.ComicNotFound, 404)
      );
    }

    res.json({
      comic,
    });
  } catch (err) {
    return next(new MiddlewareError(err.message, 500));
  }
});

/**
 * Update comic information
 */
router.put(`/:id`, getAuth, async (req, res, next) => {
  const user: User = req["UserRequest"];
  const comicId: string = req.params.id;
  // Check authorization
  if (!user) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401)
    );
  }

  // Check permissions
  if (!user.hasPermission(PermissionEnum.COMIC_UPDATE)) {
    return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
  }

  // Extract content from body
  const { name, description } = req.body;

  try {
    // Try to update comic
    await ComicController.updateComic(comicId, name, description);
  } catch (err) {
    return next(new MiddlewareError(err.message, 500));
  }
});

/**
 * TODO: create comic chapter
 */

const ComicRouter = router;
export default ComicRouter;
