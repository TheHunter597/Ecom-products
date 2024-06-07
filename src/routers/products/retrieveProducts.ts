import { NextFunction, Request, Response, Router } from "express";
import productFilterer from "../../utils/productFilterer";
import { NotFound } from "@mainmicro/jscommonlib";
import ProductModel from "../../models/main/ProductsModel";
let router = Router();

async function retrieveProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let products = ProductModel.find({}).populate({
      path: "creator",
      select: "id",
    });
    let productsFiltered = new productFilterer(products, req.query);
    let finalProducts = await productsFiltered.query;
    console.log({ finalProducts }, "finalProducts");

    return res.status(200).json({
      message: "Products retrieved successfully.",
      count: finalProducts.length,
      products: finalProducts,
    });
  } catch (err) {
    return next(new NotFound("Products not found."));
  }
}

router.get("/api/v1/products/", retrieveProducts);

export { router as retrieveProductsRouter };
