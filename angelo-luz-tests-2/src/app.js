/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
/* eslint-disable no-return-assign */
import express from "express";
import cors from "cors";
import { uuid } from "uuidv4";

const app = express();

app.use(express.json());
app.use(cors());

let products = [];

app.get("/products", (request, response) => {
  // TODO: get all products
});

app.post("/products", (request, response) => {
  // TODO: save products in the array
});

app.put("/products/:id", (request, response) => {
  // TODO: update product by id
});

app.delete("/products/:code", (request, response) => {
  // TODO: remove product by code
});

app.post("/products/:code/love", (request, response) => {
  // TODO: add 1 love in a product by code
});

app.get("/products/:code", (request, response) => {
  // TODO: get products by code
});

export default app;
