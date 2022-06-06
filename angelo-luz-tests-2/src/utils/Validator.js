export class Validator {
  static validProduct(product) {
    const { description, buyPrice, sellPrice } = product;
    if (description.length < 3 || description.length > 50) {
      throw new Error("Description should have between 3 and 50 characters");
    }

    if (buyPrice <= 0) {
      throw new Error("Buy price need to be positive");
    }

    if (buyPrice > sellPrice) {
      throw new Error("Buy price cannot be greater than sell price");
    }

    return product;
  }
}
