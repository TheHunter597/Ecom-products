import app from "../../app";
import request from "supertest";
export default async function createFakeProduct(
  user: {
    token: string;
  },
  override: { [key: string]: any } = {}
) {
  let productData = {
    title: "HyperX Cloud II Gaming Headset",
    price: 25.0,
    description:
      "Lorem ipsum dolor sit amet consectetur. Maecenas id enim auctor etiam.",
    image: "test.jpg",
    category: "headset",
    countInStock: 10,
    colors: [
      {
        name: "black",
        hex: "000000",
      },
      {
        name: "white",
        hex: "ffffff",
      },
    ],
    sizes: [
      {
        name: "small",
        abbreviation: "S",
      },
      {
        name: "medium",
        abbreviation: "M",
      },
    ],
    features: [
      {
        name: "brand",
        description: "Google",
      },
    ],
    tags: ["headset"],
  };
  productData = { ...productData, ...override };
  let response = await request(app)
    .post("/api/v1/products/create/")
    .set("Authorization", `Bearer ${user.token}`)
    .send(productData);
  return response.body.product;
}
