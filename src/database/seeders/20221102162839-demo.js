'use strict';

const { faker } = require('@faker-js/faker');

const users = Array.from({ length: 50 }).map(() => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    address: faker.address.streetAddress(),
    password: faker.internet.password(),
    avatar: faker.system.commonFileName('jpg'),
    roleId: 1

  }
})

const transactions = [
  ...Array.from({ length: 50 }).map(() => {
    const userId = faker.datatype.number({ min: 0, max: 50, presicion: 1 })
    return {
      concept: faker.random.words(3),
      amount: faker.datatype.number({ min: 0.5, max: 100, precision: 0.01 }),
      type: faker.datatype.number({ min: 0, max: 1, precision: 1 }),
      transactionDate: faker.date.past(),
      password: faker.internet.password(),
      originUserId: userId,
      destinationUserId: userId,
      categoryId: faker.helpers.arrayElement([0, 1])

    }
  }),
  // a cuple of users that made transferences
  {
    concept: faker.random.words(3),
    amount: faker.datatype.number({ min: 0.5, max: 100, precision: 0.01 }),
    type: 2,
    transactionDate: faker.date.past(),
    password: faker.internet.password(),
    originUserId: 5,
    destinationUserId: 20,
    categoryId: 't'

  },
  {
    concept: faker.random.words(3),
    amount: faker.datatype.number({ min: 0.5, max: 100, precision: 0.01 }),
    type: 2,
    transactionDate: faker.date.past(),
    password: faker.internet.password(),
    originUserId: 44,
    destinationUserId: 3

  }
]

const roles = [
  {
    id: 0,
    name: 'extAgency',
    description: 'a monetary agent external from this wallet'
  },
  {
    id: 1,
    name: 'admin',
    description: 'administrator role'
  },
  {
    id: 2,
    name: 'usr',
    description: 'a common user'
  },
]

const categories = [
  // i: income, e: expense, t: transfer
  {
    name: 'transfer',
    type: 't',
    description: faker.lorem.words()
  },
  {
    name: 'grocery store',
    type: 'e',
    description: faker.lorem.words()
  },
  {
    name: 'lotery',
    type: 'i',
    description: faker.lorem.words()
  },
]

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('User', users, {});
    await queryInterface.bulkInsert('Transaction', transactions, {});
    await queryInterface.bulkInsert('Role', roles, {});
    await queryInterface.bulkInsert('Categoty', categories, {});
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('User', null, {});
    await queryInterface.bulkDelete('Transaction', null, {});
    await queryInterface.bulkInsert('Role', null, {});
    await queryInterface.bulkInsert('Categoty', null, {});

  }
};
