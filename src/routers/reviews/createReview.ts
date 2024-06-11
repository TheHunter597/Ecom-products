import { NextFunction, Request, Response, Router } from "express";
import ProductModel from "../../models/main/ProductsModel";
import {
  NotFound,
  ValidationError,
  BadRequest,
  validateInput,
  checkUserAuthenticated,
} from "@mainmicro/jscommonlib";
import ReviewModel from "../../models/main/ReviewModel";

import mongoose from "mongoose";
import UserModel from "../../models/main/UserModel";
let router = Router();

async function createReview(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let productId = req.params.id;
    if (!productId || mongoose.Types.ObjectId.isValid(productId) === false) {
      return next(new NotFound("Product not found."));
    }
    let product = await ProductModel.find({ _id: productId }).populate(
      "reviews"
    );
    if (product.length === 0) {
      return next(new NotFound("Product not found."));
    }
    let user = await UserModel.find({ id: req.user.user_id });
    for (const review of product[0].reviews) {
      //@ts-ignore
      if (review.creator.toString() === user[0]._id.toString()) {
        return next(new BadRequest("You already reviewed this product."));
      }
    }
    let creator = await UserModel.find({ id: req.user.user_id });

    let newReview = await ReviewModel.createReview({
      creator: creator[0]._id,
      product: productId,
      ...req.body,
    });
    product[0].reviews.push(newReview._id);

    await product[0].save();
    res.status(201).json({
      message: "Review created successfully.",
      review: newReview,
    });
  } catch (error: any) {
    return next(
      new ValidationError("Error happened while creating review.", error)
    );
  }
}

router.post(
  "/api/v1/products/:id/reviews/create/",
  checkUserAuthenticated,
  validateInput(["review", "rating"], "Error happened while creating review."),
  createReview
);

export { router as createReviewRouter };
