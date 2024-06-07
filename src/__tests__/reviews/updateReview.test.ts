import request from "supertest";
import app from "../../app";
import createFakeUser from "../../utils/tests/createFakeUser";
import createFakeProduct from "../../utils/tests/createFakeProduct";
import createFakeReview from "../../utils/tests/createFakeReview";

function createUrl(id: string) {
  return `/api/v1/product/${id}/reviews/create/`;
}

function updateUrl(reviewId: string) {
  return `/api/v1/reviews/${reviewId}/`;
}

describe("update review works correctly", () => {
  test("if user isnt authenticated returns 401", async () => {
    let newUser = await createFakeUser();
    let newProduct = await createFakeProduct({ token: newUser.token });
    let response = await request(app)
      .post(createUrl(newProduct.id))
      .send({ review: "this is a review", rating: 5 });
    expect(response.status).toEqual(401);
    expect(response.body["message"]).toEqual(
      "Authentication credentials were not provided."
    );
  });
  test("if user is authenticated but review does not exist returns 404", async () => {
    let { token } = await createFakeUser();
    let newProduct = await createFakeProduct({ token: token });
    await createFakeReview(newProduct.id, token);
    let updateResponse = await request(app)
      .put(updateUrl("123"))
      .set("Authorization", `Bearer ${token}`)
      .send({ review: "this is new review title", rating: 5 });
    expect(updateResponse.status).toEqual(404);
    expect(updateResponse.body["message"]).toEqual("Review not found.");
  });
  test("if validation fails returns 400", async () => {
    let { token } = await createFakeUser();
    let newProduct = await createFakeProduct({ token: token });
    let newReview = await createFakeReview(newProduct.id, token);
    let updateResponse = await request(app)
      .put(updateUrl(newReview.body["review"]["id"]))
      .set("Authorization", `Bearer ${token}`)
      .send({ review: "this is new review title", rating: 6 });
    expect(updateResponse.status).toEqual(400);
    expect(updateResponse.body["message"]).toEqual(
      "Error happened while updating review."
    );
    expect(updateResponse.body["errors"]["rating"]).toEqual([
      "Ensure this value is less than or equal to 5.",
    ]);
  });
  test("if everything is ok returns 200", async () => {
    let { token } = await createFakeUser();
    let newProduct = await createFakeProduct({ token: token });
    let newReview = await createFakeReview(newProduct.id, token);
    let updateResponse = await request(app)
      .put(updateUrl(newReview.body["review"]["id"]))
      .set("Authorization", `Bearer ${token}`)
      .send({ review: "this is new review title", rating: 5 });
    expect(updateResponse.status).toEqual(200);
    expect(updateResponse.body["message"]).toEqual(
      "Review updated successfully."
    );
    expect(updateResponse.body["review"]["review"]).toEqual(
      "this is new review title"
    );
    expect(updateResponse.body["review"]["rating"]).toEqual(5);
  });
});
