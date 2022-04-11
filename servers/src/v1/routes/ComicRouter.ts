import { ComicFunction } from "./functions/ComicFunction";
import express from "express";
import { getAuth } from "../middlewares/AuthMiddleware";
const router = express.Router();

router.post("/", getAuth, ComicFunction.createNewComic);
router.get("/", ComicFunction.getAllComics);
router.get("/trending", ComicFunction.getAllComicTrending);

/**
 *
 * Increase the view count 1 unit
 */
router.post(`/:id/viewed`, ComicFunction.increaseComicView);

/**
 * Create comic chapter
 */
router.post(`/:id/chapters`, getAuth, ComicFunction.createChapter);

router.put(`/:id/chapters/:chapterId`, getAuth, ComicFunction.updateChapter);
router.delete(`/:id/chapters/:chapterId`, getAuth, ComicFunction.deleteChapter);

/**
 * Search comic via id or slug
 *
 */
router.get(`/search/`, ComicFunction.searchComic);
/**
 * Get all chapters inside a book
 */
router.get(`/:id/chapters`, ComicFunction.getChapter);

router.get(`/:id/chapters/:chapterId`, ComicFunction.getChapterById);

router.get("/chapters/newest", ComicFunction.getNewestChapters);

/**
 * Retrieves all view type enum object.
 */
router.get(`/chapters/viewType`, ComicFunction.getAllViewTypes);

/**
 * Get a SPECIFIC comic chapter by its id
 */
router.get(`/chapters/chapter/:chapterId/`, ComicFunction.getComicAndChapterById);

/**
 * Create new tag with specific keyword
 */
router.post(`/tags/`, getAuth, ComicFunction.createNewTag);

/**
 * Update tag with specific keyword
 */
router.put(`/tags/:id`, getAuth, ComicFunction.updateTag);

/**
 * Delete tag
 */
router.delete(`/tags/:id`, getAuth, ComicFunction.deleteTag);

/**
 * Get all tags
 */
router.get(`/tags/`, ComicFunction.getAllTags);

/**
 * Create refs
 */
router.post(`/:comicId/tags/:tagId`, getAuth, ComicFunction.createRefTag);

/**
 * Get all comic tags
 */
router.get(`/:comicId/tags/`, ComicFunction.getAllComicTags);

/**
 * Delete ref between tag and comic
 */
router.delete(`/:comicId/tags/:tagId`, getAuth, ComicFunction.deleteRefBetweenTagAndComic);

/**
 * Get a comic by id
 */
router.get(`/:id`, ComicFunction.getComicById);

/**
 * Update comic information
 */

router.put(`/:id`, getAuth, ComicFunction.updateComicById);

/**
 * Delete comic
 */
router.delete(`/:id`, getAuth, ComicFunction.deleteComicById);

const ComicRouter = router;
export default ComicRouter;
