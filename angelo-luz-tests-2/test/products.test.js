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
  expect(response.body).toMatchObject(products);
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
