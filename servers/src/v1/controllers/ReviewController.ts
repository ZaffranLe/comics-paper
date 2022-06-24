import { Tables } from "./../Database";
import DatabaseBuilder from "../utils/DatabaseBuilder";
/**
 * Create a new review
 */
async function createReview(comicId, userId, rating, content) {
    const transaction = await DatabaseBuilder.transaction();
    try {
        const review = {
            comicId,
            userId,
            rating,
            content,
        };
        const comicInfo = await DatabaseBuilder(Tables.Comic).where({ comicId }).first();
        const numberOfReviews = await DatabaseBuilder(Tables.ComicReview).where({ comicId });
        const newRating =
            (comicInfo.likes * numberOfReviews.length + rating) / (numberOfReviews.length + 1);
        await transaction(Tables.ComicReview).insert(review);
        await transaction(Tables.Comic).where({ id: comicId }).update({ likes: newRating });
        await transaction.commit();
        return review;
    } catch (e) {
        await transaction.rollback();
        throw e;
    }
}

function filterResponse(response) {
    return {
        id: response.reviewId,
        comic: {
            id: response.comicId,
            name: response.comicName,
            postedBy: response.comicPostedBy,
            createdAt: response.comicCreatedAt,
            updatedAt: response.comicUpdatedAt,
            thumbnail: response.comicThumbnail,
            views: response.comicViews,
            likes: response.comicLikes,
            slug: response.comicSlug,
        },
        user: {
            id: response.userId,
            username: response.userUsername,
            nickname: response.userNickname,
            introduction: response.userIntroduction,
        },
        rating: response.rating,
        content: response.content,
        createdAt: response.createdAt,
    };
}

async function getReviewById(reviewId) {
    const response = await DatabaseBuilder(Tables.ComicReview)
        .select()
        .column(
            { reviewId: `${Tables.ComicReview}.id` },
            { comicId: `${Tables.ComicReview}.comicId` },
            { comicName: `${Tables.Comic}.name` },
            { comicPostedBy: `${Tables.Comic}.postedBy` },
            { comicCreatedAt: `${Tables.Comic}.createdAt` },
            { comicUpdatedAt: `${Tables.Comic}.updatedAt` },
            { comicThumbnail: `${Tables.Comic}.thumbnail` },
            { comicViews: `${Tables.Comic}.views` },
            { comicLikes: `${Tables.Comic}.likes` },
            { comicSlug: `${Tables.Comic}.slug` },
            { userId: `${Tables.ComicReview}.userId` },
            { rating: `${Tables.ComicReview}.rating` },
            { content: `${Tables.ComicReview}.content` },
            { createdAt: `${Tables.ComicReview}.createdAt` },
            { userUsername: `${Tables.User}.username` },
            { userNickname: `${Tables.User}.nickname` },
            { userIntroduction: `${Tables.User}.introduction` }
        )
        .where(`${Tables.ComicReview}.id`, reviewId)
        .join(Tables.Comic, `${Tables.ComicReview}.comicId`, `${Tables.Comic}.id`)
        .join(Tables.User, `${Tables.ComicReview}.userId`, `${Tables.User}.id`)
        .first();
    if (!response) {
        return undefined;
    }
    return filterResponse(response);
}

async function getReviewsByComicId(comicId) {
    const responses: any[] = await DatabaseBuilder(Tables.ComicReview)
        .select()
        .column(
            { reviewId: `${Tables.ComicReview}.id` },
            { comicId: `${Tables.ComicReview}.comicId` },
            { comicName: `${Tables.Comic}.name` },
            { comicPostedBy: `${Tables.Comic}.postedBy` },
            { comicCreatedAt: `${Tables.Comic}.createdAt` },
            { comicUpdatedAt: `${Tables.Comic}.updatedAt` },
            { comicThumbnail: `${Tables.Comic}.thumbnail` },
            { comicViews: `${Tables.Comic}.views` },
            { comicLikes: `${Tables.Comic}.likes` },
            { comicSlug: `${Tables.Comic}.slug` },
            { userId: `${Tables.ComicReview}.userId` },
            { rating: `${Tables.ComicReview}.rating` },
            { content: `${Tables.ComicReview}.content` },
            { createdAt: `${Tables.ComicReview}.createdAt` },
            { userUsername: `${Tables.User}.username` },
            { userNickname: `${Tables.User}.nickname` },
            { userIntroduction: `${Tables.User}.introduction` }
        )
        .where(`${Tables.ComicReview}.comicId`, comicId)
        .join(Tables.Comic, `${Tables.ComicReview}.comicId`, `${Tables.Comic}.id`)
        .join(Tables.User, `${Tables.ComicReview}.userId`, `${Tables.User}.id`);

    return responses.map((response) => {
        return filterResponse(response);
    });
}

async function deleteReview(reviewId: string) {
    return await DatabaseBuilder(Tables.ComicReview)
        .where(`${Tables.ComicReview}.id`, reviewId)
        .delete();
}

async function updateReview(reviewId: string, rating: number, content: number) {
    return await DatabaseBuilder(Tables.ComicReview)
        .where(`${Tables.ComicReview}.id`, reviewId)
        .update({ content, rating });
}

async function getReviewsByUserId(userId: string) {
    const responses: any[] = await DatabaseBuilder(Tables.ComicReview)
        .select()
        .column(
            { reviewId: `${Tables.ComicReview}.id` },
            { comicId: `${Tables.ComicReview}.comicId` },
            { comicName: `${Tables.Comic}.name` },
            { comicPostedBy: `${Tables.Comic}.postedBy` },
            { comicCreatedAt: `${Tables.Comic}.createdAt` },
            { comicUpdatedAt: `${Tables.Comic}.updatedAt` },
            { comicThumbnail: `${Tables.Comic}.thumbnail` },
            { comicViews: `${Tables.Comic}.views` },
            { comicLikes: `${Tables.Comic}.likes` },
            { comicSlug: `${Tables.Comic}.slug` },
            { userId: `${Tables.ComicReview}.userId` },
            { rating: `${Tables.ComicReview}.rating` },
            { content: `${Tables.ComicReview}.content` },
            { createdAt: `${Tables.ComicReview}.createdAt` },
            { userUsername: `${Tables.User}.username` },
            { userNickname: `${Tables.User}.nickname` },
            { userIntroduction: `${Tables.User}.introduction` }
        )
        .where(`${Tables.ComicReview}.userId`, userId)
        .join(Tables.Comic, `${Tables.ComicReview}.comicId`, `${Tables.Comic}.id`)
        .join(Tables.User, `${Tables.ComicReview}.userId`, `${Tables.User}.id`);

    return responses.map((response) => {
        return filterResponse(response);
    });
}

const ReviewController = {
    createReview,
    getReviewById,
    getReviewsByComicId,
    deleteReview,
    updateReview,
    getReviewsByUserId,
};
export default ReviewController;
