/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
/* eslint-disable no-return-assign */
import express from "express";
import cors from "cors";
import { Product } from "./models/Product";

const app = express();

app.use(express.json());
app.use(cors());

let products = [];

app.get("/products", (_request, response) => {
  return response.json(products);
});

app.post("/products", (request, response) => {
  const { code, description, buyPrice, sellPrice, tags, id } = request.body;

  const productAlreadyExists = products.find(
    (product) => product.code === code
  );

  const lovers = productAlreadyExists ? productAlreadyExists.lovers : 0;

  const product = new Product(
    code,
    description,
    buyPrice,
    sellPrice,
    tags,
    lovers,
    id
  );

  products.push(product);

  return response.status(201).send(product);
});

app.put("/products/:id", (request, response) => {
  const { id } = request.params;
  const { description, buyPrice, sellPrice, tags } = request.body;

  const product = products.find((product) => product.id === id);

  if (!product) {
    return response.status(400).send();
  }

  product.description = description;
  product.buyPrice = buyPrice;
  product.sellPrice = sellPrice;
  product.tags = tags;

  return response.json(product);
});

app.delete("/products/:code", (request, response) => {
  const { code } = request.params;

  const index = products.findIndex((product) => product.code == code);

  if (index === -1) {
    return response.status(400).send();
  }

  products = products.filter((product) => product.code != code);

  return response.status(204).send();
});

app.post("/products/:code/love", (request, response) => {
  const { code } = request.params;

  const product = products.find((product) => product.code == code);

  if (!product) {
    return response.status(400).send();
  }

  products
    .filter((product) => product.code == code)
    .map((product) => (product.lovers += 1));

  return response.json({ lovers: product.lovers });
});

app.get("/products/:code", (request, response) => {
  const { code } = request.params;

  const productsFound = products.filter((product) => product.code == code);

  if (productsFound.length === 0) {
    return response.status(204).send();
  }
  return response.json(productsFound);
});

export default app;
