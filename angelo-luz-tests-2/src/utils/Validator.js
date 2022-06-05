export class Validator {
  static validProduct(product) {
    const { description } = product;
    if (description.length < 3) {
      throw new Error("Description should have between 3 and 50 characters");
    }

    return product;
  }
}
