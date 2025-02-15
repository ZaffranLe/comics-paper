import express from "express";
import { getAuth } from "../middlewares/AuthMiddleware";
import ReviewFunction from "./functions/ReviewFunction";
const router = express.Router();

router.post(`/`, getAuth, ReviewFunction.createReview);
router.get(`/review/:reviewId`, ReviewFunction.getReviewById);
router.get(`/comic/:comicId`, ReviewFunction.getReviewsByComicId);
router.put(`/:reviewId`, getAuth, ReviewFunction.updateReview);
router.delete(`/:reviewId`, getAuth, ReviewFunction.deleteReview);
router.get("/user/:userId", ReviewFunction.getReviewsByUserId);

const ReviewRouter = router;
export default ReviewRouter;
