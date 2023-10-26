const {faker} = require('@faker-js/faker');

exports.generateMockProducts = () => {
  const products = [];
  for (let i = 0; i < 50; i++) {
    const product = {
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      category: faker.commerce.department()
    };
    products.push(product);
  }
  return products;
};