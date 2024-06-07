import { NextFunction, Request, Response, Router } from "express";
import { NotFound, checkUserAuthenticated } from "@mainmicro/jscommonlib";
import ProductModel from "../../models/main/ProductsModel";
import UserModel from "../../models/main/UserModel";
let router = Router();

async function myProducts(req: Request, res: Response, next: NextFunction) {
  try {
    let creator = await UserModel.findOne({ id: req.user.user_id });
    console.log("in hererer");

    if (creator == null || creator.is_active == false) {
      return next(new NotFound("User not found."));
    }
    let products = await ProductModel.find({
      creator: creator._id,
    });

    return res.status(200).json({
      message: "Products retrieved successfully.",
      count: products.length,
      products: products,
    });
  } catch (err) {
    return next(new NotFound("Products not found."));
  }
}

router.get("/api/v1/my-products/", checkUserAuthenticated, myProducts);

export { router as myProductsRouter };
