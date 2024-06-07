import express from "express";
import cors from "cors";
import { createProductRouter } from "./routers/products/createProduct";
import { updateProductRouter } from "./routers/products/updateProduct";
import { deleteProductRouter } from "./routers/products/deleteProduct";
import { retrieveProductRouter } from "./routers/products/retrieveProduct";
import { retrieveProductsRouter } from "./routers/products/retrieveProducts";
import { createReviewRouter } from "./routers/reviews/createReview";
import { retrieveAllReviewsRouter } from "./routers/reviews/getAllReviews";
import { deleteReviewsRouter } from "./routers/reviews/deleteAllReviews";
import { updateReviewRouter } from "./routers/reviews/updateReview";
import { retrieveReviewRouter } from "./routers/reviews/retrieveReview";
import { ErrorHandler } from "@mainmicro/jscommonlib";
import { addCategoryRouter } from "./routers/categories/addCategory";
import { getCategoriesRouter } from "./routers/categories/getCategories";
import { createFakeReviewRouter } from "./routers/reviews/createFakeReviews";
import { deleteProductsRouter } from "./routers/products/deleteAllProducts";
import { myProductsRouter } from "./routers/products/myProducts";
import { healthCheckRouter } from "./routers/health";

let app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://frontend:3000",
  })
);
app.use(createProductRouter);
app.use(updateProductRouter);
app.use(deleteProductRouter);
app.use(retrieveProductRouter);
app.use(retrieveProductsRouter);
//////////////////////////
app.use(createReviewRouter);
app.use(retrieveAllReviewsRouter);
app.use(deleteReviewsRouter);
app.use(updateReviewRouter);
app.use(retrieveReviewRouter);
app.use(myProductsRouter);
//////////////////////////
app.use(addCategoryRouter);
app.use(getCategoriesRouter);

app.use(
  process.env.ENV != "PRODUCTION" ? createFakeReviewRouter : express.Router()
);
app.use(deleteProductsRouter);
/////////////////////////
app.use(healthCheckRouter);
app.use(ErrorHandler);
/////////////////////
app.use(healthCheckRouter);
export default app;
