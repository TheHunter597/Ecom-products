import { NextFunction, Request, Response, Router } from "express";
import ProductModel from "../../models/main/ProductsModel";
import { NotFound } from "@mainmicro/jscommonlib";
import errorCatcher from "../../errorCatcher";
let router = Router();

async function retrieveProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let product = await ProductModel.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "creator",
        select: "first_name last_name avatar email",
      },
    })
    .populate({
      path: "creator",
      select: "id",
    });
  console.log({ product }, "product");

  if (!product) {
    return next(new NotFound("There is no such a product"));
  }

  return res.status(200).json({
    message: "Product retrieved successfully.",
    product,
  });
}

router.get("/api/v1/products/:id/", errorCatcher(retrieveProduct));

export { router as retrieveProductRouter };
