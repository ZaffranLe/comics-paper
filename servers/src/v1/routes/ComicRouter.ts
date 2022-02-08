import { keyword } from "chalk";
import { ComicChapterViewTypeEnum } from "./../interfaces/ComicChapterInterface";
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
import ComicTagController from "../controllers/ComicTagController";
import ComicBookTagController from "../controllers/ComicBookTagController";
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
        return next(
            new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403)
        );
    }

    // Extract content from body
    const { name, description, thumbnail } = req.body;

    if (!name || !description) {
        return next(
            new MiddlewareError(
                Locale.HttpResponseMessage.MissingRequiredFields,
                400
            )
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
 *
 * Increase the view count 1 unit
 */
router.post(`/:id/viewed`, async (req, res, next) => {
    const comicId: string = req.params.id;
    try {
        // Check the id
        if (!(await ComicController.hasComic(comicId))) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.ComicNotFound,
                    404
                )
            );
        }
        // Increase 1 unit of view count
        await ComicController.updateViewComic(req.params.id);
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
    try {
        const user: User = req["UserRequest"];
        const comicId: string = req.params.id;
        // Check field
        if (!comicId) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.MissingRequiredFields,
                    400
                )
            );
        }

        // Check authorization
        if (!user) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.Unauthorized,
                    401
                )
            );
        }

        // Check permissions
        if (!(await user.hasPermission(PermissionEnum.COMIC_CHAPTER_CREATE))) {
            return next(
                new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403)
            );
        }

        // Extract content from body
        const { name, viewType, blocks } = req.body;

        if (!name) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.MissingRequiredFields,
                    400
                )
            );
        }
        console.log(comicId);

        if (viewType !== "image" && viewType !== "text") {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.ChapterViewTypeInvalid,
                    400
                )
            );
        }

        const generatedChapter = await ComicChapterController.createChapter(
            name,
            comicId,
            user.id,
            viewType === "image"
                ? ComicChapterViewTypeEnum.COMIC_CHAPTER_VIEW_TYPE_IMAGE
                : ComicChapterViewTypeEnum.COMIC_CHAPTER_VIEW_TYPE_TEXT
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
            ).then(async (blockList) => {
                await ComicChapterController.updateChapterLength(
                    chapterId,
                    blockList.length
                );

                res.status(201).json({
                    chapter: generatedChapter,
                    blocks: blockList,
                });
            });
        }
    } catch (err) {
        return next(new MiddlewareError(err.message, 500));
    }
});

router.get(`/:id/chapters`, async (req, res, next) => {
    try {
        const comicId: string = req.params.id;
        const { limit, page, sortedBy, order } = req.query;

        // Check this comic
        if (!(await ComicController.hasComic(comicId))) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.ComicNotFound,
                    404
                )
            );
        }

        const chapters = await ComicChapterController.getChaptersFromComic(
            comicId,
            {
                limit: parseInt(limit as string),
                page: parseInt(page as string),
                sortedBy: sortedBy as string,
                order: order as "asc" | "desc",
            }
        );
        // console.log(chapters);
        res.json(chapters);
    } catch (err) {
        return next(new MiddlewareError(err.message, 500));
    }
});

/**
 * Retrieves all view type enum object.
 */
router.get(`/chapters/viewType`, (req, res, next) => {
    res.json([
        {
            id: 1,
            name: "image",
        },
        {
            id: 2,
            name: "text",
        },
    ]);
});

/**
 * Get a SPECIFIC comic chapter by its id
 */
router.get(`/chapters/chapter/:chapterId/`, async (req, res, next) => {
    try {
        const chapterId: string = req.params.chapterId;
        const chapter = await ComicChapterController.getChapter(chapterId);

        console.log(chapter);
        res.json(chapter);
    } catch (err) {
        return next(new MiddlewareError(err.message, 500));
    }
});

/**
 * Create new tag with specific keyword
 */
router.post(`/tags/`, getAuth, async (req, res, next) => {
    try {
        // Check authorization
        const user: User = req["UserRequest"];
        if (!user) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.Unauthorized,
                    401
                )
            );
        }

        // Check permissions
        if (!(await user.hasPermission(PermissionEnum.COMIC_TAG_CREATE))) {
            return next(
                new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403)
            );
        }
        const { keyword } = req.body;

        // Check field
        if (!keyword) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.MissingRequiredFields,
                    400
                )
            );
        }

        // Check whether tag exists
        if ((await ComicTagController.getTag(keyword)) != null) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.ComicTagAlreadyExists,
                    400
                )
            );
        }

        const tag = await ComicTagController.createTag(keyword);
        res.json(tag);
    } catch (err) {
        next(new MiddlewareError(err.message, 500));
    }
});

/**
 * Update tag with specific keyword
 */
router.put(`/tags/:id`, getAuth, async (req, res, next) => {
    try {
        // Check authorization
        const user: User = req["UserRequest"];
        if (!user) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.Unauthorized,
                    401
                )
            );
        }

        // Check permissions
        if (!(await user.hasPermission(PermissionEnum.COMIC_TAG_CREATE))) { // TODO: change to COMIC_TAG_UPDATE
            return next(
                new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403)
            );
        }
        const { id } = req.params;
        const { keyword } = req.body;

        // Check field
        if (!keyword) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.MissingRequiredFields,
                    400
                )
            );
        }

        // Check whether tag exists
        if ((await ComicTagController.getTag(keyword)) != null) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.ComicTagAlreadyExists,
                    400
                )
            );
        }

        const tag = await ComicTagController.updateTag(id, keyword);
        res.json(tag);
    } catch (err) {
        next(new MiddlewareError(err.message, 500));
    }
});

/**
 * Delete tag
 */
router.delete(`/tags/:id`, getAuth, async (req, res, next) => {
    try {
        // Check authorization
        const user: User = req["UserRequest"];
        if (!user) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.Unauthorized,
                    401
                )
            );
        }

        // Check permissions
        if (!(await user.hasPermission(PermissionEnum.COMIC_TAG_CREATE))) { // TODO: change to COMIC_TAG_DELETE
            return next(
                new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403)
            );
        }
        const { id } = req.params;

        await ComicTagController.deleteTag(id);
        res.json(id);
    } catch (err) {
        next(new MiddlewareError(err.message, 500));
    }
});

/**
 * Get all tags
 */
router.get(`/tags/`, async (req, res, next) => {
    try {
        const tags = await ComicTagController.getTags();
        res.json(tags);
    } catch (err) {
        next(new MiddlewareError(err.message, 500));
    }
});

/**
 * Create refs
 */
router.post(`/:comicId/tags/:tagId`, getAuth, async (req, res, next) => {
    try {
        // Check authorization
        const user: User = req["UserRequest"];
        if (!user) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.Unauthorized,
                    401
                )
            );
        }

        // Check permissions
        if (
            !(await user.hasPermission(
                PermissionEnum.COMIC_BOOK_TAG_REF_CREATE
            ))
        ) {
            return next(
                new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403)
            );
        }

        const { tagId, comicId } = req.params;
        // const { comicId } = req.body;

        // Check field
        if (!tagId || !comicId) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.MissingRequiredFields,
                    400
                )
            );
        }

        // Check whether tag exists
        if ((await ComicTagController.getTagById(tagId)) == null) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.ComicTagNotFound,
                    404
                )
            );
        }

        // Check whether comic exists
        if (!(await ComicController.hasComic(comicId))) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.ComicNotFound,
                    404
                )
            );
        }

        // Check whether comic tag exists
        if (await ComicBookTagController.hasRef(comicId, tagId)) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.ComicTagAlreadyExists,
                    400
                )
            );
        }

        await ComicBookTagController.createRefTag(comicId, tagId);
        res.status(204).end();
    } catch (err) {
        next(new MiddlewareError(err.message, 500));
    }
});

/**
 * Get all comic tags
 */
router.get(`/:comicId/tags/`, async (req, res, next) => {
    try {
        const comicId: string = req.params.comicId;
        const tags = await ComicBookTagController.getRefsByComicId(comicId);
        res.json(tags);
    } catch (err) {
        next(new MiddlewareError(err.message, 500));
    }
});

/**
 * Delete ref between tag and comic
 */
router.delete(`/:comicId/tags/:tagId`, getAuth, async (req, res, next) => {
    try {
        // Check authorization
        const user: User = req["UserRequest"];
        if (!user) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.Unauthorized,
                    401
                )
            );
        }

        // Check permissions
        if (
            !(await user.hasPermission(
                PermissionEnum.COMIC_BOOK_TAG_REF_DELETE
            ))
        ) {
            return next(
                new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403)
            );
        }

        const { tagId, comicId } = req.params;
        // const { comicId } = req.body;

        // Check field
        if (!tagId || !comicId) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.MissingRequiredFields,
                    400
                )
            );
        }

        // Check whether tag exists
        if ((await ComicTagController.getTagById(tagId)) == null) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.ComicTagNotFound,
                    404
                )
            );
        }

        // Check whether comic exists
        if (!(await ComicController.hasComic(comicId))) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.ComicNotFound,
                    404
                )
            );
        }

        // Check whether comic tag exists
        if (!(await ComicBookTagController.hasRef(comicId, tagId))) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.ComicTagNotFound,
                    404
                )
            );
        }

        await ComicBookTagController.deleteRef(comicId, tagId);
        res.status(204).end();
    } catch (err) {
        next(new MiddlewareError(err.message, 500));
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
              new MiddlewareError(
                  Locale.HttpResponseMessage.ComicNotFound,
                  404
              )
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
          new MiddlewareError(
              Locale.HttpResponseMessage.MissingRequiredFields,
              400
          )
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
      return next(
          new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403)
      );
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
          new MiddlewareError(
              Locale.HttpResponseMessage.MissingRequiredFields,
              400
          )
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
      return next(
          new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403)
      );
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

const ComicRouter = router;
export default ComicRouter;
