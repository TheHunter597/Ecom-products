import { NextFunction, Request, Response, Router } from "express";
import ProductModel from "../../models/main/ProductsModel";
import UserModel from "../../models/main/UserModel";
import {
  Unauthorized,
  ValidationError,
  validateInput,
  checkUserAuthenticated,
} from "@mainmicro/jscommonlib";
import ProductCreatedProducerInstance from "../../kafka/products/ProductCreatedProducer";
import validate from "../../kafka/schema/validator";
import mongoose from "mongoose";
let router = Router();
export default async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /// making the function atomic any error reveret any db changes back :)
  let session = await mongoose.connection.startSession();
  session.startTransaction();
  try {
    let creatorName =
      req.user.first_name && req.user.last_name
        ? req.user.first_name + " " + req.user.last_name
        : req.user.email;
    let creator = await UserModel.find({ id: req.user.user_id });

    if (creator.length == 0) {
      return next(new Unauthorized("User not found."));
    }

    let newProduct = await ProductModel.createProduct(
      {
        creator: creator[0]._id,
        creatorName,
        ...req.body,
      },
      session
    );
    let priceAfterDiscount = 0;
    if (req.body.discount) {
      priceAfterDiscount =
        newProduct[0].price - (newProduct[0].price * req.body.discount) / 100;
    }
    let kafkaMessage = {
      id: newProduct[0].id,
      title: newProduct[0].title,
      price: priceAfterDiscount != 0 ? priceAfterDiscount : newProduct[0].price,
      image: newProduct[0].image,
      colors: newProduct[0].colors,
      sizes: newProduct[0].sizes,
      countInStock: newProduct[0].countInStock,
    };

    validate(JSON.stringify(kafkaMessage), "ProductCreatedEvent");
    ProductCreatedProducerInstance.sendMessage(kafkaMessage);
    await session.commitTransaction();
    session.endSession();
    return res.status(201).json({
      message: "Product created successfully.",
      product: newProduct,
    });
  } catch (err: any) {
    console.log({ err });

    await session.abortTransaction();
    session.endSession();
    return next(
      new ValidationError("Error happened while creating product.", err)
    );
  }
}

router.post(
  "/api/v1/products/create/",
  checkUserAuthenticated,
  validateInput(
    [
      "title",
      "price",
      "description",
      "colors",
      "image",
      "category",
      "countInStock",
    ],
    "Error happened while creating product."
  ),
  createProduct
);

export { router as createProductRouter };
