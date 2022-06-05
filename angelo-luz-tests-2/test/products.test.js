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
