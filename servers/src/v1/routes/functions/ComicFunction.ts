import { ComicChapterViewTypeEnum } from "./../../interfaces/ComicChapterInterface";
import { User } from "./../../classes/User";
import { PermissionEnum } from "./../../interfaces/PermissionInterface";
import { ComicInterface } from "./../../interfaces/ComicInterface";
import { Locale } from "./../../Locale";
import { MiddlewareError } from "./../../errors/MiddlewareError";
import ComicController from "../../controllers/ComicController";
import ResourceController from "../../controllers/ResourceController";
import ComicChapterController from "../../controllers/ComicChapterController";
import ComicChapterBlockController from "../../controllers/ComicChapterBlockController";
import ComicTagController from "../../controllers/ComicTagController";
import ComicBookTagController from "../../controllers/ComicBookTagController";
import ComicCommentController from "../../controllers/ComicCommentController";

export const ComicFunction = {
    increaseComicView: async (req, res, next) => {
        const comicId: number = req.params.id;
        try {
            // Check the id
            if (!(await ComicController.hasComic(comicId))) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.ComicNotFound, 404));
            }
            // Increase 1 unit of view count
            await ComicController.updateViewComic(req.params.id);
            // Response
            res.status(204).end();
        } catch (err) {
            return next(new MiddlewareError(err.message, 500));
        }
    },
    followComic: async (req, res, next) => {
        const comicId = req.params.id;
        try {
            // Check the id
            if (!(await ComicController.hasComic(comicId))) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.ComicNotFound, 404));
            }
            // Follow the comic
            const isFollowing = await ComicController.followComic(req.UserRequest.id, comicId);
            // Response
            res.json(isFollowing);
        } catch (err) {
            return next(new MiddlewareError(err.message, 500));
        }
    },
    getFollowState: async (req, res, next) => {
        const comicId = req.params.id;
        try {
            // Check the id
            if (!(await ComicController.hasComic(comicId))) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.ComicNotFound, 404));
            }
            // Get the follow state
            const isFollowing = await ComicController.getFollowState(req.UserRequest.id, comicId);
            // Response
            res.json(isFollowing);
        } catch (err) {
            return next(new MiddlewareError(err.message, 500));
        }
    },
    getFollowingComics: async (req, res, next) => {
        try {
            const comics: ComicInterface[] = await ComicController.getFollowingComics();
            // Response
            res.json(comics);
        } catch (err) {
            return next(new MiddlewareError(err.message, 500));
        }
    },
    getAllComics: async (req, res, next) => {
        try {
            const comics: ComicInterface[] = await ComicController.getAllComics(req.query);
            // Response
            res.json(comics);
        } catch (err) {
            return next(new MiddlewareError(err.message, 500));
        }
    },
    getComicByUser: async (req, res, next) => {
        try {
            const userId = req.params.id;
            const comics: ComicInterface[] = await ComicController.getComicByUser(userId);
            // Response
            res.json(comics);
        } catch (err) {
            return next(new MiddlewareError(err.message, 500));
        }
    },
    getAllComicTrending: async (req, res, next) => {
        try {
            const comics = await ComicController.getAllComicTrending(req.query);
            // Response
            res.json(comics);
        } catch (err) {
            return next(new MiddlewareError(err.message, 500));
        }
    },
    createNewComic: async (req, res, next) => {
        const user: User = req["UserRequest"];

        // Authorization required
        if (!user) {
            return next(new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401));
        }

        // Check permissions
        if (!(await user.hasPermission(PermissionEnum.COMIC_CREATE))) {
            return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
        }

        // Extract content from body
        const { name, description, thumbnail, author, category, tags } = req.body;

        if (!name || !description) {
            return next(new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 400));
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
                author,
                category,
                tags,
                thumbnail
            );

            // Send response
            res.status(201).json({
                comic,
            });
        } catch (err) {
            return next(new MiddlewareError(err.message, 500));
        }
    },

    createChapter: async (req, res, next) => {
        try {
            const user: User = req["UserRequest"];
            const comicId: number = req.params.id;
            // Check field
            if (!comicId) {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 400)
                );
            }

            // Check authorization
            if (!user) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401));
            }

            // Check permissions
            if (!(await user.hasPermission(PermissionEnum.COMIC_CHAPTER_CREATE))) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
            }

            // Extract content from body
            const { name, viewType, blocks, chapterNumber } = req.body;

            if (!name) {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 400)
                );
            }
            if (viewType !== "image" && viewType !== "text") {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.ChapterViewTypeInvalid, 400)
                );
            }

            const generatedChapter = await ComicChapterController.createChapter(
                name,
                comicId,
                user.id,
                viewType === "image"
                    ? ComicChapterViewTypeEnum.COMIC_CHAPTER_VIEW_TYPE_IMAGE
                    : ComicChapterViewTypeEnum.COMIC_CHAPTER_VIEW_TYPE_TEXT,
                blocks,
                chapterNumber
            );

            res.status(201).json({
                chapter: generatedChapter,
            });
        } catch (err) {
            return next(new MiddlewareError(err.message, 500));
        }
    },

    updateChapter: async (req, res, next) => {
        try {
            const user: User = req["UserRequest"];
            const comicId: number = req.params.id;
            const chapterId: number = req.params.chapterId;
            // Check field
            if (!comicId) {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 400)
                );
            }

            // Check authorization
            if (!user) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401));
            }

            // Check permissions
            if (!(await user.hasPermission(PermissionEnum.COMIC_CHAPTER_CREATE))) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
            }

            // Extract content from body
            const { name, viewType, blocks, chapterNumber } = req.body;

            if (!name) {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 400)
                );
            }
            if (viewType !== "image" && viewType !== "text") {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.ChapterViewTypeInvalid, 400)
                );
            }

            const generatedChapter = await ComicChapterController.updateChapter(
                chapterId,
                name,
                comicId,
                user.id,
                viewType === "image"
                    ? ComicChapterViewTypeEnum.COMIC_CHAPTER_VIEW_TYPE_IMAGE
                    : ComicChapterViewTypeEnum.COMIC_CHAPTER_VIEW_TYPE_TEXT,
                blocks,
                chapterNumber
            );

            res.status(201).json({
                chapter: generatedChapter,
                blocks,
            });
        } catch (err) {
            return next(new MiddlewareError(err.message, 500));
        }
    },

    deleteChapter: async (req, res, next) => {
        try {
            const user: User = req["UserRequest"];
            const comicId: number = req.params.id;
            const chapterId: number = req.params.chapterId;
            // Check field
            if (!comicId) {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 400)
                );
            }

            // Check authorization
            if (!user) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401));
            }

            // Check permissions
            if (!(await user.hasPermission(PermissionEnum.COMIC_CHAPTER_CREATE))) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
            }

            const generatedChapter = await ComicChapterController.deleteChapter(chapterId);

            res.status(200).send();
        } catch (err) {
            return next(new MiddlewareError(err.message, 500));
        }
    },

    getChapter: async (req, res, next) => {
        try {
            const comicId: number = req.params.id;
            const { limit, page, sortedBy, order } = req.query;

            // Check this comic
            if (!(await ComicController.hasComic(comicId))) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.ComicNotFound, 404));
            }

            const chapters = await ComicChapterController.getChaptersFromComic(comicId, {
                limit: parseInt(limit as string),
                page: parseInt(page as string),
                sortedBy: sortedBy as string,
                order: order as "asc" | "desc",
            });
            // console.log(chapters);
            res.json(chapters);
        } catch (err) {
            return next(new MiddlewareError(err.message, 500));
        }
    },

    getChapterById: async (req, res, next) => {
        try {
            const comicId: number = req.params.id;
            const chapterId: number = req.params.chapterId;

            // Check this comic
            if (!(await ComicController.hasComic(comicId))) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.ComicNotFound, 404));
            }

            const chapter = await ComicChapterController.getChapter(chapterId);
            res.json(chapter);
        } catch (err) {
            return next(new MiddlewareError(err.message, 500));
        }
    },

    getNewestChapters: async (req, res, next) => {
        try {
            const chapters = await ComicChapterController.getNewestChapters();
            res.json(chapters);
        } catch (err) {
            return next(new MiddlewareError(err.message, 500));
        }
    },

    getAllViewTypes: (req, res, next) => {
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
    },

    getComicAndChapterById: async (req, res, next) => {
        try {
            const chapterId: number = req.params.chapterId;
            const chapter = await ComicChapterController.getChapter(chapterId);

            console.log(chapter);
            res.json(chapter);
        } catch (err) {
            return next(new MiddlewareError(err.message, 500));
        }
    },

    createNewTag: async (req, res, next) => {
        try {
            // Check authorization
            const user: User = req["UserRequest"];
            if (!user) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401));
            }

            // Check permissions
            if (!(await user.hasPermission(PermissionEnum.COMIC_TAG_CREATE))) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
            }
            const { keyword } = req.body;

            // Check field
            if (!keyword) {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 400)
                );
            }

            // Check whether tag exists
            if ((await ComicTagController.getTag(keyword)) != null) {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.ComicTagAlreadyExists, 400)
                );
            }

            const tag = await ComicTagController.createTag(keyword);
            res.json(tag);
        } catch (err) {
            next(new MiddlewareError(err.message, 500));
        }
    },

    updateTag: async (req, res, next) => {
        try {
            // Check authorization
            const user: User = req["UserRequest"];
            if (!user) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401));
            }

            // Check permissions
            if (!(await user.hasPermission(PermissionEnum.COMIC_TAG_UPDATE))) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
            }
            const { id } = req.params;
            const { keyword } = req.body;

            // Check field
            if (!keyword) {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 400)
                );
            }

            // Check whether tag exists
            if ((await ComicTagController.getTag(keyword)) != null) {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.ComicTagAlreadyExists, 400)
                );
            }

            const tag = await ComicTagController.updateTag(id, keyword);
            res.json(tag);
        } catch (err) {
            next(new MiddlewareError(err.message, 500));
        }
    },

    deleteTag: async (req, res, next) => {
        try {
            // Check authorization
            const user: User = req["UserRequest"];
            if (!user) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401));
            }

            // Check permissions
            if (!(await user.hasPermission(PermissionEnum.COMIC_TAG_DELETE))) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
            }
            const { id } = req.params;

            await ComicTagController.deleteTag(id);
            res.json(id);
        } catch (err) {
            next(new MiddlewareError(err.message, 500));
        }
    },

    getAllTags: async (req, res, next) => {
        try {
            const tags = await ComicTagController.getTags();
            res.json(tags);
        } catch (err) {
            next(new MiddlewareError(err.message, 500));
        }
    },

    createRefTag: async (req, res, next) => {
        try {
            // Check authorization
            const user: User = req["UserRequest"];
            if (!user) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401));
            }

            // Check permissions
            if (!(await user.hasPermission(PermissionEnum.COMIC_BOOK_TAG_REF_CREATE))) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
            }

            const { tagId, comicId } = req.params;
            // const { comicId } = req.body;

            // Check field
            if (!tagId || !comicId) {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 400)
                );
            }

            // Check whether tag exists
            if ((await ComicTagController.getTagById(tagId)) == null) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.ComicTagNotFound, 404));
            }

            // Check whether comic exists
            if (!(await ComicController.hasComic(comicId))) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.ComicNotFound, 404));
            }

            // Check whether comic tag exists
            if (await ComicBookTagController.hasRef(comicId, tagId)) {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.ComicTagAlreadyExists, 400)
                );
            }

            await ComicBookTagController.createRefTag(comicId, tagId);
            res.status(204).end();
        } catch (err) {
            next(new MiddlewareError(err.message, 500));
        }
    },

    getAllComicTags: async (req, res, next) => {
        try {
            const comicId: number = req.params.comicId;
            const tags = await ComicBookTagController.getRefsByComicId(comicId);
            res.json(tags);
        } catch (err) {
            next(new MiddlewareError(err.message, 500));
        }
    },

    deleteRefBetweenTagAndComic: async (req, res, next) => {
        try {
            // Check authorization
            const user: User = req["UserRequest"];
            if (!user) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401));
            }

            // Check permissions
            if (!(await user.hasPermission(PermissionEnum.COMIC_BOOK_TAG_REF_DELETE))) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
            }

            const { tagId, comicId } = req.params;
            // const { comicId } = req.body;

            // Check field
            if (!tagId || !comicId) {
                return next(
                    new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 400)
                );
            }

            // Check whether tag exists
            if ((await ComicTagController.getTagById(tagId)) == null) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.ComicTagNotFound, 404));
            }

            // Check whether comic exists
            if (!(await ComicController.hasComic(comicId))) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.ComicNotFound, 404));
            }

            // Check whether comic tag exists
            if (!(await ComicBookTagController.hasRef(comicId, tagId))) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.ComicTagNotFound, 404));
            }

            await ComicBookTagController.deleteRef(comicId, tagId);
            res.status(204).end();
        } catch (err) {
            next(new MiddlewareError(err.message, 500));
        }
    },

    getComicById: async (req, res, next) => {
        const url: string = req.params.id;
        const [slug, id] = url.split("&");
        try {
            const comic: ComicInterface = await ComicController.getComic(id);
            // not found
            if (!comic || comic.slug !== slug) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.ComicNotFound, 404));
            }

            res.json({
                comic,
            });
        } catch (err) {
            return next(new MiddlewareError(err.message, 500));
        }
    },

    updateComicById: async (req, res, next) => {
        const user: User = req["UserRequest"];
        const comicId: number = req.params.id;
        // Check field
        if (!comicId) {
            return next(new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 400));
        }
        // Check authorization
        if (!user) {
            return next(new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401));
        }

        // Check permissions
        if (!(await user.hasPermission(PermissionEnum.COMIC_UPDATE))) {
            return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
        }

        // Extract content from body
        const { name, description, thumbnail, author, category, tags } = req.body;

        try {
            // Try to update comic
            await ComicController.updateComic(
                comicId,
                name,
                description,
                author,
                category,
                tags,
                thumbnail
            );
            // Response
            res.status(204).end();
        } catch (err) {
            return next(new MiddlewareError(err.message, 500));
        }
    },

    deleteComicById: async (req, res, next) => {
        const user: User = req["UserRequest"];
        const comicId: number = req.params.id;
        // Check field
        if (!comicId) {
            return next(new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 400));
        }

        // Check authorization
        if (!user) {
            return next(new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401));
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
    },
    searchComic: async (req, res, next) => {
        try {
            const comic = await ComicController.searchComic(req.query);

            // Not found
            if (comic) {
                return next(new MiddlewareError(Locale.HttpResponseMessage.ComicNotFound, 404));
            }

            // Response me
            res.json(comic);
        } catch (err) {
            return next(new MiddlewareError(err.message, 500));
        }
    },
};
