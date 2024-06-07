import app from "../../app";
import request from "supertest";
function createUrl(id: string) {
  return `/api/v1/product/${id}/reviews/create/`;
}
export default async function createFakeReview(
  productId: string,
  token: string,
  productData = { review: "this is a review", rating: 5 }
) {
  let response = await request(app)
    .post(createUrl(productId))
    .set("Authorization", `Bearer ${token}`)
    .send(productData);

  return response;
}
