import express from "express";
import { getAuth } from "../middlewares/AuthMiddleware";
import CommentFunction from "./functions/CommentFunction";
const router = express.Router();

/**
 * Create new comment for the comic chapter
 */
router.post(`/:chapterId/comments/`, getAuth, CommentFunction.createComment);
/**
 * Get comment from comment id
 */
router.get(`/comment/:commentId`, CommentFunction.getCommentByCommentId);
/**
 * Get all comments for a specific comic chapter
 */
router.get(`/chapter/:chapterId`, CommentFunction.getAllComments);
/**
 * Updates the comments
 */
router.put(`/comment/:commentId`, getAuth, CommentFunction.updateComment);
/**
 * Delete comment
 *
 */
router.delete(`/comment/:commentId`, getAuth, CommentFunction.deleteComment);
router.get("/user/:userId", CommentFunction.getAllCommentsByUserId);
/**
 * Exports this router
 */
const CommentRouter = router;
export default CommentRouter;
