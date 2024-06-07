import { NextFunction, Request, Response, Router } from "express";
import CategoryModel from "../../models/main/CategoryModel";
import { checkUserAuthenticated, validateInput } from "@mainmicro/jscommonlib";

const router = Router();

function addCategory(req: Request, res: Response, next: NextFunction) {
  const { name, image } = req.body;

  const newCategory = new CategoryModel({
    name,
    image,
  });

  newCategory.save();

  res.json({
    message: "Category added successfully",
  });
}

router.post(
  "/api/v1/products/category/",
  checkUserAuthenticated,
  validateInput(["name", "image"]),

  addCategory
);

export { router as addCategoryRouter };
