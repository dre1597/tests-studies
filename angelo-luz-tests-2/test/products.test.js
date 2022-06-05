/* eslint-disable no-undef */
import request from "supertest";

import app from "../src/app";

let products;

beforeEach(() => {
  products = [
    {
      code: 1,
      description: "Product 1",
      buyPrice: 4000,
      sellPrice: 8000,
      tags: ["tag1", "tag2"],
    },
    {
      code: 2,
      description: "Product 2",
      buyPrice: 2000,
      sellPrice: 4000,
      tags: ["tag2", "tag3"],
    },
    {
      code: 1,
      description: "Product 3",
      buyPrice: 3000,
      sellPrice: 6000,
      tags: ["tag1", "tag3"],
    },
  ];
});

test("CreateProduct - Should be possible add a new product", async () => {
  const response = await request(app).post("/products").send(products[0]);

  expect(response.body).toMatchObject({
    ...products[0],
    lovers: 0,
  });
});

test("CreateProduct - Should return 201 on success", async () => {
  const response = await request(app).post("/products").send(products[0]);

  expect(response.statusCode).toBe(201);
});

test("UpdateProduct - Should be possible update a product", async () => {
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

test("UpdateProduct - Should not be possible do updated an inexistent product", async () => {
  const response = await request(app).put("/products/1");

  expect(response.statusCode).toBe(400);
});

test("DeleteProduct - Should not be possible do delete an inexistent product", async () => {
  const response = await request(app).delete("/products/-1");

  expect(response.statusCode).toBe(400);
});

test("DeleteProduct - Should return 204 on success", async () => {
  const response = await request(app).post("/products").send(products[0]);

  const responseDelete = await request(app).delete(
    `/products/${response.body.code}`
  );

  expect(responseDelete.statusCode).toBe(204);
});

test("ListProducts - Should be possible to list all the products", async () => {
  await request(app).post("/products").send(products[0]);
  await request(app).post("/products").send(products[1]);

  const response = await request(app).get("/products");

  expect(response.body).toHaveLength(2);
  expect(response.body).toMatchObject([products[0], products[1]]);
});

test("DeleteProduct - Should be possible to delete all products with the same code", async () => {
  const response = await request(app).post("/products").send(products[0]);
  await request(app).post("/products").send(products[0]);

  await request(app).delete(`/products/${response.body.code}`);

  const responseGet = await request(app).get("/products");

  expect(responseGet.body).toHaveLength(1);
  expect(responseGet.body).toMatchObject([products[1]]);
});

test("GetProduct - Should be possible to get a product by code", async () => {
  const response = await request(app).post("/products").send(products[0]);
  await request(app).post("/products").send(products[0]);

  const responseGet = await request(app).get(`/products/${response.body.code}`);

  expect(responseGet.body).toHaveLength(2);
  expect(responseGet.body).toMatchObject([products[0], products[0]]);
});

test("GetProduct - Should return 204 if there is not a product with the code", async () => {
  const response = await request(app).get("/products/-1");

  expect(response.status).toBe(204);
});

test("UpdateProduct - Should be not possible to update the number of lovers manually", async () => {
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

test("LoveProduct - Should be possible to add a love to a product", async () => {
  const response = await request(app).post("/products").send(products[0]);

  const responseLove = await request(app)
    .post(`/products/${response.body.code}/love`)
    .send();

  expect(responseLove.body).toMatchObject({
    lovers: 1,
  });
});

test("LoveProduct - Should return 400 if not find the product by the code", async () => {
  const response = await request(app).post(`/products/-1/love`).send();

  expect(response.status).toBe(400);
});

test("LoveProduct - A Product with the same code should extends the number of lovers of the others products with the same code", async () => {
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
