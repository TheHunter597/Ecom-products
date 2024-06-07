import request from "supertest";
import app from "../../app";
import createFakeUser from "../../utils/tests/createFakeUser";
import createFakeProduct from "../../utils/tests/createFakeProduct";

function createUrl(id: string) {
  return `/api/v1/product/${id}/reviews/create/`;
}

describe("review routers work correctly", () => {
  test("if user isnt authenticated", async () => {
    let newUser = await createFakeUser();
    let newProduct = await createFakeProduct({ token: newUser.token });
    let response = await request(app)
      .post(createUrl(newProduct.id))
      .send({ review: "test", rating: 5 });
    expect(response.status).toEqual(401);
    expect(response.body["message"]).toEqual(
      "Authentication credentials were not provided."
    );
  });
  test("creating reviews without params returns 404", async () => {
    let { token } = await createFakeUser();
    let newProduct = await createFakeProduct({ token: token });
    let response = await request(app)
      .post(createUrl(newProduct.id))
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toEqual(400);
    expect(response.body["message"]).toEqual(
      "Error happened while creating review."
    );
    expect(response.body["errors"]["review"]).toEqual([
      "This field is required.",
    ]);
    expect(response.body["errors"]["rating"]).toEqual([
      "This field is required.",
    ]);
  });
  test("creating reviews with invalid params returns 400", async () => {
    let { token } = await createFakeUser();
    let newProduct = await createFakeProduct({ token: token });
    let response = await request(app)
      .post(createUrl(newProduct.id))
      .send({ review: "test", rating: 6 })
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toEqual(400);
    expect(response.body["message"]).toEqual(
      "Error happened while creating review."
    );
    expect(response.body["errors"]["rating"]).toEqual([
      "Ensure this value is less than or equal to 5.",
    ]);
  });
  test("if product does not exist returns 404", async () => {
    let { token } = await createFakeUser();
    let newProduct = await createFakeProduct({ token: token });
    let response = await request(app)
      .post(createUrl("123"))
      .send({ review: "this is review", rating: 5 })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(404);
    expect(response.body["message"]).toEqual("Product not found.");
  });
  test("if product exists and user is authenticated returns 201", async () => {
    let { token } = await createFakeUser();
    let newProduct = await createFakeProduct({ token: token });
    let response = await request(app)
      .post(createUrl(newProduct.id))
      .send({ review: "this is review", rating: 5 })
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toEqual(201);
    expect(response.body["message"]).toEqual("Review created successfully.");
  });
  test("product average rating changes when new review is created", async () => {
    let { token } = await createFakeUser();
    let newProduct = await createFakeProduct({ token: token });
    await request(app)
      .post(createUrl(newProduct.id))
      .send({ review: "this is review", rating: 5 })
      .set("Authorization", `Bearer ${token}`);
    let response = await request(app).get(`/api/v1/products/${newProduct.id}/`);
    expect(response.status).toEqual(200);
    expect(response.body["message"]).toEqual("Product retrieved successfully.");
    expect(response.body["product"]["reviews"].length).toEqual(1);
    expect(response.body["product"]["rating"]).toEqual(5);
  });
  test("if user already reviewed product returns 400", async () => {
    let { token } = await createFakeUser();
    let newProduct = await createFakeProduct({ token: token });
    await request(app)
      .post(createUrl(newProduct.id))
      .send({ review: "this is review", rating: 5 })
      .set("Authorization", `Bearer ${token}`);
    let response = await request(app)
      .post(createUrl(newProduct.id))
      .send({ review: "this is review", rating: 5 })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(400);
    expect(response.body["message"]).toEqual(
      "You already reviewed this product."
    );
  });
});
