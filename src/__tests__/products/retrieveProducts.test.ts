import request from "supertest";
import app from "../../app";
import createFakeUser from "../../utils/tests/createFakeUser";
import createFakeProduct from "../../utils/tests/createFakeProduct";

describe("retrieve products", () => {
  test("retrieve products with price less than 100", async () => {
    let { token } = await createFakeUser();
    let product = await createFakeProduct({ token }, { price: 99 });
    let product2 = await createFakeProduct({ token }, { price: 101 });
    let response = await request(app)
      .get(`/api/v1/products?price=lt,100`)
      .expect(200);
    expect(response.body.products.length).toBe(1);
    expect(response.body.products[0].price).toBe(99);
  });
  test("limit retrieved products to 2", async () => {
    let { token } = await createFakeUser();
    let product = await createFakeProduct({ token });
    let product2 = await createFakeProduct({ token });
    let product3 = await createFakeProduct({ token });
    let response = await request(app)
      .get(`/api/v1/products?limit=2`)
      .expect(200);
    expect(response.body.products.length).toBe(2);
  });
  test("limit retrieved products to 2 which price is less than 100", async () => {
    let { token } = await createFakeUser();
    await createFakeProduct({ token }, { price: 99 });
    await createFakeProduct({ token }, { price: 101 });
    await createFakeProduct({ token }, { price: 102 });
    await createFakeProduct({ token }, { price: 98 });
    let response = await request(app)
      .get(`/api/v1/products?limit=2&price=lt,100`)
      .expect(200);
    expect(response.body.products.length).toBe(2);
    expect(response.body.products[0].price).toBe(98);
  });
  test("sort where lowest price first", async () => {
    let { token } = await createFakeUser();
    await createFakeProduct({ token }, { price: 99 });
    await createFakeProduct({ token }, { price: 101 });
    await createFakeProduct({ token }, { price: 102 });
    await createFakeProduct({ token }, { price: 98 });
    let response = await request(app)
      .get(`/api/v1/products?limit=2&price=lt,100&sort=price`)
      .expect(200);
    expect(response.body.products.length).toBe(2);
    expect(response.body.products[0].price).toBe(98);
  });
});
