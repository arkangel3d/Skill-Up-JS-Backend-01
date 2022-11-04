'use strict';

const { faker } = require('@faker-js/faker');

const transactions = [
  ...Array.from({ length: 50 }).map(() => {
    const userId = faker.datatype.number({ min: 2, max: 22, presicion: 1 });
    return {
      concept: faker.random.words(3),
      amount: faker.datatype.number({ min: 0.5, max: 100, precision: 0.01 }),
      transactionDate: faker.date.past(),
      originUserId: userId,
      destinationUserId: userId,
      categoryId: faker.helpers.arrayElement([0, 1])
    };
  }),
  // a cuple of users that made transferences
  {
    concept: faker.random.words(3),
    amount: faker.datatype.number({ min: 0.5, max: 100, precision: 0.01 }),
    transactionDate: faker.date.past(),
    originUserId: 5,
    destinationUserId: 20,
    categoryId: 't'
  },
  {
    concept: faker.random.words(3),
    amount: faker.datatype.number({ min: 0.5, max: 100, precision: 0.01 }),
    transactionDate: faker.date.past(),
    originUserId: 20,
    destinationUserId: 3
  }
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Transactions', transactions, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Transactions', null, {});
  }
};
