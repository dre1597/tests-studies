import { v4 as uuid } from "uuid";

export class Product {
  constructor(
    code,
    description,
    buyPrice,
    sellPrice,
    tags,
    lovers = 0,
    id = uuid()
  ) {
    this.code = code;
    this.description = description;
    this.buyPrice = buyPrice;
    this.sellPrice = sellPrice;
    this.tags = tags;
    this.lovers = lovers;
    this.id = id;
  }
}
