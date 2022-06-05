/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
/* eslint-disable no-return-assign */
import express from "express";
import cors from "cors";
import { v4 as uuid } from "uuid";

const app = express();

app.use(express.json());
app.use(cors());

let products = [];

app.get("/products", (_request, response) => {
  return response.json(products);
});

app.post("/products", (request, response) => {
  const { code, description, buyPrice, sellPrice, tags } = request.body;

  const productAlreadyExists = products.find(
    (product) => product.code === code
  );

  const lovers = productAlreadyExists ? productAlreadyExists.lovers : 0;

  const product = {
    id: uuid(),
    code,
    description,
    buyPrice,
    sellPrice,
    tags,
    lovers,
  };

  products.push(product);

  response.status(201).send(product);
});

app.put("/products/:id", (request, response) => {
  const { id } = request.params;
  const { description, buyPrice, sellPrice, tags } = request.body;

  const product = products.find((product) => product.id === id);

  if (!product) {
    response.status(400).send();
  }

  product.description = description;
  product.buyPrice = buyPrice;
  product.sellPrice = sellPrice;
  product.tags = tags;

  response.json(product);
});

app.delete("/products/:code", (request, response) => {
  const { code } = request.params;

  const index = products.findIndex((product) => product.code == code);

  if (index === -1) {
    response.status(400).send();
  }

  products = products.filter((product) => product.code != code);

  response.status(204).send();
});

app.post("/products/:code/love", (request, response) => {
  // TODO: add 1 love in a product by code
});

app.get("/products/:code", (request, response) => {
  // TODO: get products by code
});

export default app;
