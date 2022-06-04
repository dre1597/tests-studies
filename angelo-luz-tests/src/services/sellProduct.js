/**
 * The amount sold can be one or more products
 * If the stock is negative it should throws an exception
 * the sell price cannot be greater than the buy price
 * @param {*} product
 * @param {*} amount
 */

export function sellProduct(product, amount) {
  product.stock -= amount;
  return product;
}
