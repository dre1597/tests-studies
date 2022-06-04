import { Product } from '../src/models';
import { sellProduct } from '../src/services';

test('should have less one in stock after sell one unit', () => {
  let product = new Product('Cellphone', 500.0, 900.0, 10);

  sellProduct(product, 1);

  expect(product.stock).toBe(9);
});

test('should have less three in stock after sell three units unit', () => {
  let product = new Product('Cellphone', 500.0, 900.0, 10);

  sellProduct(product, 3);

  expect(product.stock).toBe(7);
});
