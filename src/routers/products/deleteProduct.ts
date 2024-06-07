import { NextFunction, Request, Response, Router } from "express";
import ProductModel from "../../models/main/ProductsModel";
import {
  NotFound,
  Forbidden,
  checkUserAuthenticated,
} from "@mainmicro/jscommonlib";
import ProductDeletedProducerInstance from "../../kafka/products/ProductDeletedProducer";

let router = Router();

async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  let product = (await ProductModel.findById(req.params.id).populate({
    path: "creator",
    select: "id",
  })) as unknown as { creator: { id: string } };
  if (!product) {
    return next(new NotFound("There is no such a product"));
  }
  if (product.creator.id.toString() != req.user.user_id) {
    return next(new Forbidden("You are not the creator of this product."));
  }
  await ProductModel.deleteOne({ _id: req.params.id });
  ProductDeletedProducerInstance.sendMessage({
    id: req.params.id,
  });
  return res.status(200).json({
    message: "Product deleted successfully.",
  });
}

router.post(
  "/api/v1/products/delete/:id/",
  checkUserAuthenticated,
  deleteProduct
);

export { router as deleteProductRouter };
