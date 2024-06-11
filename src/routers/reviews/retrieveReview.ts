import { NextFunction, Request, Response, Router } from "express";
import { NotFound } from "@mainmicro/jscommonlib";
import ReviewModel from "../../models/main/ReviewModel";
let router = Router();

async function retrieveReview(req: Request, res: Response, next: NextFunction) {
  let review = await ReviewModel.find({ _id: req.params.id });
  if (review.length === 0) {
    return next(new NotFound("There is no such a review"));
  }
  return res.status(200).json({
    message: "Review retrieved successfully.",
    review,
  });
}

router.get("/api/v1/products/reviews/:id/", retrieveReview);

export { router as retrieveReviewRouter };
