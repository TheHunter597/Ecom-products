import app from "../../app";
import request from "supertest";
import createFakeUser from "../../utils/tests/createFakeUser";

describe("creating product works", () => {
  it("if user isnt authenticated return 401", async () => {
    let response = await request(app).post("/api/v1/products/create/");
    expect(response.status).toEqual(401);
    expect(response.body["message"]).toEqual(
      "Authentication credentials were not provided."
    );
  });
  it("create products without inputs", async () => {
    let { token } = await createFakeUser();
    let response = await request(app)
      .post("/api/v1/products/create")
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(response.status).toEqual(400);
    expect(response.body["message"]).toEqual(
      "Error happened while creating product."
    );
    expect(response.body.errors["title"][0]).toEqual("This field is required.");
    expect(response.body.errors["price"][0]).toEqual("This field is required.");
    expect(response.body.errors["description"][0]).toEqual(
      "This field is required."
    );
    expect(response.body.errors["image"][0]).toEqual("This field is required.");
    expect(response.body.errors["category"][0]).toEqual(
      "This field is required."
    );
    expect(response.body.errors["countInStock"][0]).toEqual(
      "This field is required."
    );
    expect(response.body.errors["colors"][0]).toEqual(
      "This field is required."
    );
    expect(response.body.errors["features"][0]).toEqual(
      "This field is required."
    );
  });
  it("create product with wrong inputs", async () => {
    let { token } = await createFakeUser();
    let response = await request(app)
      .post("/api/v1/products/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "test",
        price: "0",
        description: "test",
        image: "test",
        category: "test",
        countInStock: 1000001,
        colors: "test",
        sizes: "test",
        features: "test",
      });

    expect(response.status).toEqual(400);
    expect(response.body["message"]).toEqual(
      "Error happened while creating product."
    );
    expect(response.body["errors"]["title"][0]).toEqual(
      "Ensure this field has at least 8 characters."
    );
    expect(response.body["errors"]["description"][0]).toEqual(
      "Ensure this field has at least 20 characters."
    );
    expect(response.body["errors"]["price"][0]).toEqual(
      "Ensure this value is greater than or equal to 1."
    );
    expect(response.body["errors"]["colors"][0]).toEqual(
      'Cast to embedded failed for value "test" (type string) at path "colors" because of "ObjectParameterError"'
    );
    expect(response.body["errors"]["countInStock"][0]).toEqual(
      "Ensure this value is less than or equal to 1000000."
    );
  });
  it("create product with correct inputs", async () => {
    let { token } = await createFakeUser();
    let response = await request(app)
      .post("/api/v1/products/create/")
      .set("Authorization", `Bearer ${token}`)
      .send({
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
      });

    expect(response.status).toEqual(201);
    expect(response.body["message"]).toEqual("Product created successfully.");
    /////////
    expect(response.body.product["title"]).toEqual(
      "HyperX Cloud II Gaming Headset"
    );
    expect(response.body.product["price"]).toEqual(25.0);
    expect(response.body.product["description"]).toEqual(
      "Lorem ipsum dolor sit amet consectetur. Maecenas id enim auctor etiam."
    );
    expect(response.body.product["image"]).toEqual("test.jpg");
    expect(response.body.product["category"]).toEqual("headset");
    expect(response.body.product["countInStock"]).toEqual(10);
    /////////
    expect(response.body.product["colors"][0].name).toEqual("black");
    expect(response.body.product["colors"][0].hex).toEqual("000000");
    expect(response.body.product["colors"][1].name).toEqual("white");
    expect(response.body.product["colors"][1].hex).toEqual("ffffff");
    /////////
    expect(response.body.product["sizes"][0].name).toEqual("small");
    expect(response.body.product["sizes"][0].abbreviation).toEqual("S");
    expect(response.body.product["sizes"][1].name).toEqual("medium");
    expect(response.body.product["sizes"][1].abbreviation).toEqual("M");
    /////////
    expect(response.body.product["features"][0].name).toEqual("Created At");
    expect(response.body.product["features"][1].name).toEqual("Updated At");
    expect(response.body.product["features"][2].name).toEqual("Creator");
    expect(response.body.product["features"][3].name).toEqual("brand");
  }, 10000);
});
