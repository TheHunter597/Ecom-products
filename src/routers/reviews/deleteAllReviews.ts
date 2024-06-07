import { NextFunction, Request, Response, Router } from "express";
import ReviewModel from "../../models/main/ReviewModel";
let router = Router();

async function deleteAll(req: Request, res: Response, next: NextFunction) {
  await ReviewModel.deleteMany({});
  return res.status(200).json({
    message: "Reviews retrieved successfully.",
  });
}

router.post("/api/v1/reviews/delete/", deleteAll);

export { router as deleteReviewsRouter };
