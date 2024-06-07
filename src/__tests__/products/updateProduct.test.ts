import request from "supertest";
import app from "../../app";
import createFakeUser from "../../utils/tests/createFakeUser";
import createFakeProduct from "../../utils/tests/createFakeProduct";
describe("update product", () => {
  let url = "/api/v1/products/update/";
  test("update product with user not authenticated", async () => {
    let { token } = await createFakeUser();
    let product = await createFakeProduct({ token });
    let response = await request(app).put(`${url}${product.id}/`);
    expect(response.status).toEqual(401);
    expect(response.body["message"]).toEqual(
      "Authentication credentials were not provided."
    );
  });
  test("if product dosent exist", async () => {
    let { token } = await createFakeUser();
    let product = await createFakeProduct({ token });
    let response = await request(app)
      .put(`${url}123123123123123123123123/`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "pepsimango",
      });
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
      .put(`${url}${firstProduct.id}/`)
      .set("Authorization", `Bearer ${secondUser.token}`);
    expect(response.status).toEqual(403);
    expect(response.body["message"]).toEqual(
      "You are not the creator of this product."
    );
  });
  test("if user is the creator but wrong inputs validations", async () => {
    let { token } = await createFakeUser();
    let product = await createFakeProduct({ token });
    let response = await request(app)
      .put(`${url}${product.id}/`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "test",
      });
    expect(response.status).toEqual(400);
    expect(response.body["message"]).toEqual(
      "Error happened while updating product."
    );
    expect(response.body["errors"]["title"]).toEqual([
      "Ensure this field has at least 8 characters.",
    ]);
  });
  test("if user is the creator and correct inputs validations", async () => {
    let { token } = await createFakeUser();
    let product = await createFakeProduct({ token });
    let response = await request(app)
      .put(`${url}${product.id}/`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "pepsimango",
      });
    expect(response.status).toEqual(200);
    expect(response.body["message"]).toEqual("Product updated successfully.");
    expect(response.body["updatedProduct"]["title"]).toEqual("pepsimango");
  });
});
