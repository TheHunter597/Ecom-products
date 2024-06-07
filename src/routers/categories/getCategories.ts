import { NextFunction, Request, Response, Router } from "express";
import CategoryModel from "../../models/main/CategoryModel";

const router = Router();

async function getCategories(req: Request, res: Response, next: NextFunction) {
  const categories = await CategoryModel.find({});

  res.json({
    message: "Categories retrieved successfully",
    categories: categories,
  });
}

router.get("/api/v1/products/categories/all/", getCategories);

export { router as getCategoriesRouter };
