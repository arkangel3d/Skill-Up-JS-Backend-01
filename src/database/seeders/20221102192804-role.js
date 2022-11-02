'use strict';

const { faker } = require('@faker-js/faker');

const roles = [
  {
    id: 1,
    name: 'extAgency',
    description: 'a monetary agent external from this wallet'
  },
  {
    id: 2,
    name: 'admin',
    description: 'administrator role'
  },
  {
    id: 3,
    name: 'usr',
    description: 'a common user'
  },
]

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', roles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', null, {});
  }
};
