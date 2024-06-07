import { NextFunction, Request, Response, Router } from "express";
import ReviewModel from "../../models/main/ReviewModel";
import mongoose from "mongoose";
import UserModel from "../../models/main/UserModel";
import {
  NotFound,
  Unauthorized,
  ValidationError,
  checkUserAuthenticated,
} from "@mainmicro/jscommonlib";
let router = Router();

async function updateReview(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let reviewId = req.params.id;

  if (!reviewId || mongoose.Types.ObjectId.isValid(reviewId) === false) {
    return next(new NotFound("Review not found."));
  }
  let review = (await ReviewModel.find({ _id: reviewId }).populate({
    path: "creator",
    select: "id",
  })) as unknown as { creator: { id: string } }[];
  if (review.length === 0) {
    return next(new NotFound("Review not found."));
  }
  let user = await UserModel.find({ id: req.user.user_id });
  if (user.length === 0) {
    return next(new Unauthorized("You are not the creator of this review."));
  }
  try {
    let updatedReview = await ReviewModel.findOneAndUpdate(
      { _id: reviewId },
      { ...req.body },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      message: "Review updated successfully.",
      review: updatedReview,
    });
  } catch (error: any) {
    next(new ValidationError("Error happened while updating review.", error));
  }
}

router.put("/api/v1/reviews/:id/", checkUserAuthenticated, updateReview);

export { router as updateReviewRouter };
