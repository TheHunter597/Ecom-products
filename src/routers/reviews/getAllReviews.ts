import { NextFunction, Request, Response, Router } from "express";

import ReviewModel from "../../models/main/ReviewModel";

let router = Router();

async function retrieveAllReviews(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let reviews = await ReviewModel.find({ product: req.params.id }).populate(
    "product",
    "_id"
  );
  return res.status(200).json({
    message: "Reviews retrieved successfully.",
    count: reviews.length,
    reviews: reviews,
  });
}

router.get("/api/v1/product/:id/reviews/", retrieveAllReviews);

export { router as retrieveAllReviewsRouter };
