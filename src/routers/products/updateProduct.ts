import { NextFunction, Request, Response, Router } from "express";
import ProductModel from "../../models/main/ProductsModel";
import {
  NotFound,
  ValidationError,
  Forbidden,
  checkUserAuthenticated,
} from "@mainmicro/jscommonlib";
import UserModel from "../../models/main/UserModel";
import ProductUpdatedProducerInstance from "../../kafka/products/ProductUpdatedProducer";
let router = Router();
export default async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let product = await ProductModel.findById(req.params.id);

    if (!product) {
      return next(new NotFound("There is no such a product"));
    }
    let creator = await UserModel.findById(product.creator);

    if (!creator || creator.id.toString() != req.user.user_id) {
      return next(new Forbidden("You are not the creator of this product."));
    }
    delete req.body.creator;

    let updatedProduct = await ProductModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        ...req.body,
      },
      {
        runValidators: true,
        new: true,
      }
    );

    if (!updatedProduct) {
      return next(new NotFound("There is no such a product"));
    }
    console.log("second");

    ProductUpdatedProducerInstance.sendMessage({
      id: updatedProduct.id,
      data: {
        ...req.body,
      },
    });
    console.log("third");

    return res.status(200).json({
      message: "Product updated successfully.",
      updatedProduct,
    });
  } catch (err: any) {
    console.log({ err });

    return next(
      new ValidationError("Error happened while updating product.", err)
    );
  }
}

router.put(
  "/api/v1/products/update/:id/",
  checkUserAuthenticated,
  updateProduct
);

export { router as updateProductRouter };
