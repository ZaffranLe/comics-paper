import { ComicFunction } from './functions/ComicFunction';
import express from 'express';
import { getAuth } from '../middlewares/AuthMiddleware';
const router = express.Router();

router.get('/following', ComicFunction.getFollowingComics);
router.get('/trending', ComicFunction.getAllComicTrending);
router.get('/user/:id', ComicFunction.getComicByUser);

/**
 *
 * Increase the view count 1 unit
 */
router.post(`/:id/viewed`, ComicFunction.increaseComicView);
router.post('/:id/follow/', getAuth, ComicFunction.followComic);
router.get('/:id/follow/', getAuth, ComicFunction.getFollowState);
router.get(`/view-count`, ComicFunction.countView);
router.post(`/tags/`, getAuth, ComicFunction.createNewTag);
router.put(`/tags/:id`, getAuth, ComicFunction.updateTag);
router.delete(`/tags/:id`, getAuth, ComicFunction.deleteTag);
router.get(`/tags/`, ComicFunction.getAllTags);
router.get('/', ComicFunction.getAllComics);
router.post('/', getAuth, ComicFunction.createNewComic);
router.get('/chapters/newest', ComicFunction.getNewestChapters);
router.get('/trending', ComicFunction.getAllComicTrending);
router.put(`/:id`, getAuth, ComicFunction.updateComicById);
router.delete(`/:id`, getAuth, ComicFunction.deleteComicById);
router.get(`/:id/chapters`, ComicFunction.getChapter);
router.post(`/:id/chapters`, getAuth, ComicFunction.createChapter);
router.put(`/:id/chapters/:chapterId`, getAuth, ComicFunction.updateChapter);
router.delete(`/:id/chapters/:chapterId`, getAuth, ComicFunction.deleteChapter);
router.get(`/:id/chapters/:chapterId`, ComicFunction.getChapterById);

router.get(`/:id`, ComicFunction.getComicById);
router.get(`/slug/:slug`, ComicFunction.getComicBySlug);

const ComicRouter = router;
export default ComicRouter;
