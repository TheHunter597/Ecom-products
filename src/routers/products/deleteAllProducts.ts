import { NextFunction, Request, Response, Router } from "express";
import ProductModel from "../../models/main/ProductsModel";
import { NotFound } from "@mainmicro/jscommonlib";
import errorCatcher from "../../errorCatcher";
import UserModel from "../../models/main/UserModel";
let router = Router();

async function deleteProducts(req: Request, res: Response, next: NextFunction) {
  console.log("in here");

  return res.status(200).json({
    message: "done",
  });
}

router.delete("/api/v1/products/delete/", errorCatcher(deleteProducts));

export { router as deleteProductsRouter };
