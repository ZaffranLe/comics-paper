import { User } from '../../classes/User';
import ComicController from '../../controllers/ComicController';
import ReviewController from '../../controllers/ReviewController';
import { MiddlewareError } from '../../errors/MiddlewareError';
import { PermissionEnum } from '../../interfaces/PermissionInterface';
import { Locale } from '../../Locale';

const ReviewFunction = {
  createReview: async (req, res, next) => {
    try {
      const { comicId, userId, rating, content } = req.body;

      // Invalid fields
      if (!comicId || !userId || !rating || !content) {
        return next(
          new MiddlewareError(
            Locale.HttpResponseMessage.MissingRequiredFields,
            400,
          ),
        );
      }

      // Validates user
      const user: User = await req['UserRequest'];
      if (!user) {
        return next(
          new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401),
        );
      }

      // No permissions
      if (!user.hasPermission(PermissionEnum.REVIEW_CREATE)) {
        return next(
          new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403),
        );
      }

      const currentReview = await ReviewController.createReview(
        comicId,
        userId,
        rating,
        content,
      );

      res.status(201).json(currentReview);
    } catch (err) {
      next(err);
    }
  },
  getReviewById: async (req, res, next) => {
    try {
      const { reviewId } = req.params;

      // Invalid fields
      if (!reviewId) {
        return next(
          new MiddlewareError(
            Locale.HttpResponseMessage.MissingRequiredFields,
            400,
          ),
        );
      }

      const currentReview = await ReviewController.getReviewById(reviewId);
      if (!currentReview) {
        return next(
          new MiddlewareError(Locale.HttpResponseMessage.ReviewNotFound, 404),
        );
      }

      res.status(200).json(currentReview);
    } catch (err) {
      next(err);
    }
  },
  getReviewsByComicId: async (req, res, next) => {
    try {
      const { comicId } = req.params;

      // Invalid fields
      if (!comicId) {
        return next(
          new MiddlewareError(
            Locale.HttpResponseMessage.MissingRequiredFields,
            400,
          ),
        );
      }

      // Comic is not found
      const currentComic = await ComicController.getComicById(comicId);
      if (!currentComic) {
        return next(
          new MiddlewareError(Locale.HttpResponseMessage.ComicNotFound, 404),
        );
      }

      const currentReviews =
        await ReviewController.getReviewsByComicId(comicId);

      res.status(200).json(currentReviews);
    } catch (err) {
      next(err);
    }
  },
  deleteReview: async (req, res, next) => {
    try {
      const { reviewId } = req.params;

      // Invalid fields
      if (!reviewId) {
        return next(
          new MiddlewareError(
            Locale.HttpResponseMessage.MissingRequiredFields,
            400,
          ),
        );
      }

      // Validates user
      const user: User = await req['UserRequest'];
      if (!user) {
        return next(
          new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401),
        );
      }

      // No permissions
      // if (!user.hasPermission(PermissionEnum.REVIEW_DELETE) && !user.) {
      //   return next(
      //     new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403)
      //   );
      // }

      await ReviewController.deleteReview(reviewId);

      res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  },
  updateReview: async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const { rating, content } = req.body;

      // Invalid fields
      if (!reviewId) {
        return next(
          new MiddlewareError(
            Locale.HttpResponseMessage.MissingRequiredFields,
            400,
          ),
        );
      }

      // Validates user
      const user: User = await req['UserRequest'];
      if (!user) {
        return next(
          new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401),
        );
      }

      // No permissions
      // if (!user.hasPermission(PermissionEnum.REVIEW_UPDATE)) {
      //   return next(
      //     new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403)
      //   );
      // }

      const currentReview = await ReviewController.updateReview(
        reviewId,
        rating,
        content,
      );

      res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  },
  getReviewsByUserId: async (req, res, next) => {
    try {
      const { userId } = req.params;

      // Invalid fields
      if (!userId) {
        return next(
          new MiddlewareError(
            Locale.HttpResponseMessage.MissingRequiredFields,
            400,
          ),
        );
      }

      const currentReviews = await ReviewController.getReviewsByUserId(userId);

      res.status(200).json(currentReviews);
    } catch (err) {
      next(err);
    }
  },
};
export default ReviewFunction;
