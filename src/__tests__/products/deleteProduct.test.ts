import request from "supertest";
import app from "../../app";
import createFakeUser from "../../utils/tests/createFakeUser";
import createFakeProduct from "../../utils/tests/createFakeProduct";
import createFakeReview from "../../utils/tests/createFakeReview";
describe("makes sure delete product works correctly", () => {
  let url = "/api/v1/products/delete/";
  test("if user isnt authenticated", async () => {
    let { token } = await createFakeUser();
    let product = await createFakeProduct({ token });
    let response = await request(app).post(`${url}${product.id}/`);
    expect(response.status).toEqual(401);
    expect(response.body["message"]).toEqual(
      "Authentication credentials were not provided."
    );
  });
  test("if product dosent exist", async () => {
    let { token } = await createFakeUser();
    let product = await createFakeProduct({ token });
    let response = await request(app)
      .post(`${url}123123123123123123123123/`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toEqual(404);
    expect(response.body["message"]).toEqual("There is no such a product");
  });
  test("if user isnt the creator error returns", async () => {
    let firstUser = await createFakeUser();
    let secondUser = await createFakeUser({
      id: "2",
      is_active: true,
      account_confirmed: true,
      email: "mango@gmail.com",
    });
    let firstProduct = await createFakeProduct(firstUser);
    let response = await request(app)
      .post(`${url}${firstProduct.id}/`)
      .set("Authorization", `Bearer ${secondUser.token}`);
    expect(response.status).toEqual(403);
    expect(response.body["message"]).toEqual(
      "You are not the creator of this product."
    );
  });
  test("if user is the creator product is removed", async () => {
    let { token } = await createFakeUser();
    let product = await createFakeProduct({ token });
    let response = await request(app)
      .post(`${url}${product.id}/`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toEqual(200);
    expect(response.body["message"]).toEqual("Product deleted successfully.");
    let productResponse = await request(app).get(
      `/api/v1/products/${product.id}/`
    );
    expect(productResponse.status).toEqual(404);
    expect(productResponse.body["message"]).toEqual(
      "There is no such a product"
    );
  });
  test("if product have reviews all of them are deleted", async () => {
    let { token } = await createFakeUser();
    let product = await createFakeProduct({ token });
    let reviewOne = await createFakeReview(product.id, token);
    let response = await request(app)
      .post(`${url}${product.id}/`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toEqual(200);
    expect(response.body["message"]).toEqual("Product deleted successfully.");
    let reviewOneResponse = await request(app).get(
      `/api/v1/reviews/${reviewOne.body["review"]["id"]}/`
    );

    expect(reviewOneResponse.status).toEqual(404);
    expect(reviewOneResponse.body["message"]).toEqual(
      "There is no such a review"
    );
  });
});
