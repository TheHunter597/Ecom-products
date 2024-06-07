import { NextFunction, Request, Response, Router } from "express";
import ProductModel from "../../models/main/ProductsModel";
import {
  NotFound,
  ValidationError,
  validateInput,
} from "@mainmicro/jscommonlib";
import ReviewModel from "../../models/main/ReviewModel";
import { randomBytes } from "crypto";
import mongoose from "mongoose";
import UserModel from "../../models/main/UserModel";
import { faker } from "@faker-js/faker";
let router = Router();

async function createFakeReview(
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

    let creator = await UserModel.createUser({
      is_active: true,
      email: randomBytes(10).toString("hex") + "@gmail.com",
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      id: new mongoose.Types.ObjectId().toHexString(),
    });

    let newReview = await ReviewModel.createReview({
      // @ts-ignore
      creator: creator._id,
      product: product[0].id,
      rating: req.body.rating,
      review: req.body.review,
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
  "/api/v1/product/:id/reviews/create/fake/",
  validateInput(["review", "rating"], "Error happened while creating review."),
  createFakeReview
);

export { router as createFakeReviewRouter };
