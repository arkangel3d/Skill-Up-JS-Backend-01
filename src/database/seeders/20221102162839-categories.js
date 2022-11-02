'use strict';

const { faker } = require('@faker-js/faker');


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
    await queryInterface.bulkInsert('Categories', categories, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', null, {});
  }
};
