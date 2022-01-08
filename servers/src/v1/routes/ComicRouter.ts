import { ComicInterface } from "./../interfaces/ComicInterface";
import { PermissionEnum } from "./../interfaces/PermissionInterface";
import { MiddlewareError } from "./../errors/MiddlewareError";
import { Locale } from "./../Locale";
import express from "express";
import { User } from "../classes/User";
import { getAuth } from "../middlewares/AuthMiddleware";
import ComicController from "../controllers/ComicController";
import ResourceController from "../controllers/ResourceController";
import ComicChapterBlockController from "../controllers/ComicChapterBlockController";
import ComicChapterController from "../controllers/ComicChapterController";
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
  if (!(await user.hasPermission(PermissionEnum.COMIC_CREATE))) {
    return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
  }

  // Extract content from body
  const { name, description, thumbnail } = req.body;

  if (!name || !description) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 400)
    );
  }

  try {
    // Check thumbnail
    if (thumbnail && !(await ResourceController.hasResource(thumbnail))) {
      return next(
        new MiddlewareError(
          `${Locale.HttpResponseMessage.ResourceNotFound} (thumbnail)`,
          404
        )
      );
    }
    // Try to create comic
    const comic: ComicInterface = await ComicController.createComic(
      name,
      description,
      user.id,
      thumbnail
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
  // Check field
  if (!comicId) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 400)
    );
  }
  // Check authorization
  if (!user) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401)
    );
  }

  // Check permissions
  if (!(await user.hasPermission(PermissionEnum.COMIC_UPDATE))) {
    return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
  }

  // Extract content from body
  const { name, description } = req.body;

  try {
    // Try to update comic
    await ComicController.updateComic(comicId, name, description);
    // Response
    res.status(204).end();
  } catch (err) {
    return next(new MiddlewareError(err.message, 500));
  }
});

/**
 * Delete comic
 */
router.delete(`/:id`, getAuth, async (req, res, next) => {
  const user: User = req["UserRequest"];
  const comicId: string = req.params.id;
  // Check field
  if (!comicId) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 400)
    );
  }

  // Check authorization
  if (!user) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401)
    );
  }

  // Check permissions
  if (!(await user.hasPermission(PermissionEnum.COMIC_DELETE))) {
    return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
  }

  try {
    // Try to delete comic
    await ComicController.deleteComic(comicId);
    // Response
    res.status(204).end();
  } catch (err) {
    return next(new MiddlewareError(err.message, 500));
  }
});

/**
 * Create comic chapter
 */
router.post(`/:id/chapters`, getAuth, async (req, res, next) => {
  const user: User = req["UserRequest"];
  const comicId: string = req.params.id;
  // Check field
  if (!comicId) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 400)
    );
  }

  // Check authorization
  if (!user) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401)
    );
  }

  // Check permissions
  if (!(await user.hasPermission(PermissionEnum.COMIC_CHAPTER_CREATE))) {
    return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
  }

  // Extract content from body
  const { name, viewType, blocks } = req.body;
  // TODO retrieves content block list then put into database, too
  if (!name || !viewType) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 400)
    );
  }

  const generatedChapter = await ComicChapterController.createChapter(
    comicId,
    name,
    viewType,
    blocks
  );
  const { id: chapterId, length: chapterLength } = generatedChapter;
  // Create blocks from block list
  if (blocks) {
    Promise.all(
      blocks.map(async (block, index) => {
        // Create block
        await ComicChapterBlockController.createChapterBlock(
          chapterId,
          chapterLength + index,
          block.content
        );
        return block;
      })
    ).then((blockList) => {
      res.status(201).json({
        chapter: generatedChapter,
        blocks: blockList,
      });
    });
  }
});
const ComicRouter = router;
export default ComicRouter;
