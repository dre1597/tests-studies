/* eslint-disable no-undef */
import request from "supertest";

import app from "../src/app";
import { Product } from "../src/models/Product";
import { Validator } from "../src/utils/Validator";

let products;

beforeEach(
  () =>
    (products = [
      new Product(1, "Product 1", 4000, 8000, ["tag1", "tag2"]),
      new Product(2, "Product 2", 2000, 4000, ["tag2", "tag3"]),
      new Product(1, "Product 3", 3000, 6000, ["tag1", "tag3"]),
    ])
);

describe("CreateProduct", () => {
  test("Should be possible add a new product", async () => {
    const response = await request(app).post("/products").send(products[0]);

    expect(response.body).toMatchObject({
      ...products[0],
      lovers: 0,
    });
  });

  test("Should return 201 on success", async () => {
    const response = await request(app).post("/products").send(products[0]);

    expect(response.statusCode).toBe(201);
  });
});

describe("UpdateProduct", () => {
  test("Should be possible update a product", async () => {
    const response = await request(app).post("/products").send(products[0]);

    const updatedProduct = {
      ...products[0],
      description: "Product 3",
    };

    const responseUpdate = await request(app)
      .put(`/products/${response.body.id}`)
      .send(updatedProduct);

    expect(responseUpdate.body).toMatchObject(updatedProduct);
  });

  test("Should not be possible do updated an inexistent product", async () => {
    const response = await request(app).put("/products/1");

    expect(response.statusCode).toBe(400);
  });
});

describe("DeleteProduct", () => {
  test("Should not be possible do delete an inexistent product", async () => {
    const response = await request(app).delete("/products/-1");

    expect(response.statusCode).toBe(400);
  });

  test("Should return 204 on success", async () => {
    const response = await request(app).post("/products").send(products[0]);

    const responseDelete = await request(app).delete(
      `/products/${response.body.code}`
    );

    expect(responseDelete.statusCode).toBe(204);
  });
});

describe("ListProducts", () => {
  test("Should be possible to list all the products", async () => {
    await request(app).post("/products").send(products[0]);
    await request(app).post("/products").send(products[1]);

    const response = await request(app).get("/products");

    expect(response.body).toHaveLength(2);
    expect(response.body).toMatchObject([products[0], products[1]]);
  });
});

describe("DeleteProduct", () => {
  test("Should be possible to delete all products with the same code", async () => {
    const response = await request(app).post("/products").send(products[0]);
    await request(app).post("/products").send(products[0]);

    await request(app).delete(`/products/${response.body.code}`);

    const responseGet = await request(app).get("/products");

    expect(responseGet.body).toHaveLength(1);
  });
});

describe("GetProduct", () => {
  test("Should be possible to get a product by code", async () => {
    const response = await request(app).post("/products").send(products[0]);
    await request(app).post("/products").send(products[0]);

    const responseGet = await request(app).get(
      `/products/${response.body.code}`
    );

    expect(responseGet.body).toHaveLength(2);
    expect(responseGet.body).toMatchObject([products[0], products[0]]);
  });

  test("Should return 204 if there is not a product with the code", async () => {
    const response = await request(app).get("/products/-1");

    expect(response.status).toBe(204);
  });
});

describe("LoveProduct", () => {
  test("Should be not possible to update the number of lovers manually", async () => {
    const response = await request(app).post("/products").send(products[0]);

    const updatedProduct = {
      ...products[0],
      description: "Product 3",
      lovers: 10,
    };

    const expectedUpdatedProduct = {
      ...products[0],
      description: "Product 3",
    };

    const responseUpdate = await request(app)
      .put(`/products/${response.body.id}`)
      .send(updatedProduct);

    expect(responseUpdate.body).not.toMatchObject(updatedProduct);
    expect(responseUpdate.body).toMatchObject(expectedUpdatedProduct);
    expect(responseUpdate.body.lovers).not.toBe(10);
    expect(responseUpdate.body.lovers).toBe(0);
  });

  test("Should be possible to add a love to a product", async () => {
    const response = await request(app).post("/products").send(products[0]);

    const responseLove = await request(app)
      .post(`/products/${response.body.code}/love`)
      .send();

    expect(responseLove.body).toMatchObject({
      lovers: 1,
    });
  });

  test("Should return 400 if not find the product by the code", async () => {
    const response = await request(app).post(`/products/-1/love`).send();

    expect(response.status).toBe(400);
  });

  test("A Product with the same code should extends the number of lovers of the others products with the same code", async () => {
    const response = await request(app).post("/products").send(products[0]);
    await request(app).post(`/products/${response.body.code}/love`).send();
    await request(app).post(`/products/${response.body.code}/love`).send();
    await request(app).post(`/products/${response.body.code}/love`).send();
    await request(app).post("/products").send(products[2]);
    const responseGet = await request(app)
      .get(`/products/${response.body.code}`)
      .send();

    const loversArray = responseGet.body.map((product) => product.lovers);

    const index = loversArray.findIndex((elem) => elem !== 4);

    expect(index).toBe(-1);
  });

  test("Creating a product with an code that already should share the amount of the existing one", async () => {
    const response = await request(app).post("/products").send(products[0]);

    await request(app).post(`/products/${response.body.code}/love`).send();
    await request(app).post(`/products/${response.body.code}/love`).send();

    const responseSecondPost = await request(app)
      .post("/products")
      .send(products[2]);

    const responseGet = await request(app).get(
      `/products/${response.body.code}`
    );

    const firstProduct = responseGet.body.find(
      (product) => product.id === response.body.id
    );

    const secondProduct = responseGet.body.find(
      (product) => product.id === responseSecondPost.body.id
    );

    expect(firstProduct.lovers).toBe(secondProduct.lovers);
  });
});

describe("ProductValidation", () => {
  test("Should not accept description with 2 characters", () => {
    expect(() => {
      Validator.validProduct(
        new Product(1, "aa", 50.0, 80.0, ["tag1", "tag2"])
      );
    }).toThrow(
      new Error("Description should have between 3 and 50 characters")
    );
  });
  test("Should accept description with 3 characters", () => {
    const product = Validator.validProduct(
      new Product(1, "abc", 50.0, 80.0, ["tag1", "tag2"])
    );

    expect(product.description).toBe("abc");
  });
});
