import { PermissionEnum } from "./../../interfaces/PermissionInterface";
import { User } from "./../../classes/User";
import { Locale } from "./../../Locale";
import ComicChapterController from "../../controllers/ComicChapterController";
import { MiddlewareError } from "./../../errors/MiddlewareError";
import ComicCommentController from "../../controllers/ComicCommentController";

const CommentFunction = {
    createComment: async (req, res, next) => {
        try {
            // First, get the chapter and content
            const { chapterId } = req.params;
            const { content } = req.body;
            if (!content) {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 400)
                );
            }
            const chapter = await ComicChapterController.getChapter(chapterId);
            // Content is found or not
            if (!chapter) {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.ComicChapterNotFound, 404)
                );
            }

            // Check if chapter exists
            if (!chapter) {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.ComicChapterNotFound, 404)
                );
            }

            // Check if user is logged in
            const user: User = req["UserRequest"];

            if (!user) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401));
            }

            // Check if user has permission to create comment
            if (!(await user.hasPermission(PermissionEnum.COMIC_CHAPTER_COMMENT))) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
            }

            // Create comment
            const comment = await ComicCommentController.createComment(chapterId, user.id, content);

            // Response
            res.json(comment);
        } catch (err) {
            return next(new MiddlewareError(err.message, 500));
        }
    },
    getCommentByCommentId: async (req, res, next) => {
        try {
            const commentId = req.params.commentId;
            const comment = await ComicCommentController.getComment(commentId);
            // Not found
            if (!comment) {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.ComicCommentNotFound, 404)
                );
            }

            // Response
            res.json(comment);
        } catch (err) {
            return next(new MiddlewareError(err.message, 500));
        }
    },
    getAllComments: async (req, res, next) => {
        try {
            const { chapterId } = req.params;
            const chapter = await ComicChapterController.getChapter(chapterId);
            // Chapter is not found
            if (!chapter) {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.ComicChapterNotFound, 404)
                );
            }

            // Get all comments
            const comments = await ComicCommentController.getCommentByChapterId(chapterId);

            // Validates if comments are found or not
            if (!comments) {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.ComicCommentNotFound, 404)
                );
            }

            // response
            res.json(comments);
        } catch (err) {
            return next(err);
        }
    },
    updateComment: async (req, res, next) => {
        try {
            const { commentId } = req.params;
            const { content } = req.body;
            if (!content) {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 400)
                );
            }

            // Looks for comment
            const comment = await ComicCommentController.getComment(commentId);
            // Comment is not found
            if (!comment) {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.ComicCommentNotFound, 404)
                );
            }

            await ComicCommentController.updateComment(commentId, content);
            res.json({ success: true });
        } catch (err) {
            next(err);
        }
    },
    deleteComment: async (req, res, next) => {
        try {
            const { commentId } = req.params;
            const comment = await ComicCommentController.getComment(commentId);
            // Comment is not found
            if (!comment) {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.ComicCommentNotFound, 404)
                );
            }

            await ComicCommentController.deleteComment(commentId);
            res.json({ success: true });
        } catch (err) {
            next(err);
        }
    },
    getAllCommentsByUserId: async (req, res, next) => {
        try {
            const { userId } = req.params;
            const comments = await ComicCommentController.getCommentByUserId(userId);
            // Comment is not found
            if (!comments) {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.ComicCommentNotFound, 404)
                );
            }

            // response
            res.json(comments);
        } catch (err) {
            next(err);
        }
    },
};
export default CommentFunction;
