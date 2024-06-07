import request from "supertest";
import app from "../../app";
import createFakeUser from "../../utils/tests/createFakeUser";
import createFakeProduct from "../../utils/tests/createFakeProduct";

describe("retrieve product", () => {
  let url = "/api/v1/products/";
  test("if product dosent exist", async () => {
    let response = await request(app).get(`${url}123123123123123123123123/`);
    expect(response.status).toEqual(404);
    expect(response.body["message"]).toEqual("There is no such a product");
  });
  test("if product exist", async () => {
    let { token } = await createFakeUser();
    let product = await createFakeProduct({ token });
    let response = await request(app).get(`${url}${product.id}/`);
    expect(response.status).toEqual(200);
    expect(response.body["message"]).toEqual("Product retrieved successfully.");
    expect(response.body["product"]["name"]).toEqual(product.name);
    expect(response.body["product"]["description"]).toEqual(
      product.description
    );
    expect(response.body["product"]["price"]).toEqual(product.price);
    expect(response.body["product"]["quantity"]).toEqual(product.quantity);
  });
});
