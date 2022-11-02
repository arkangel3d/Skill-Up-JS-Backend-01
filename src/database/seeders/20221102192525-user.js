'use strict';
const { faker } = require('@faker-js/faker');

const users = Array.from({ length: 50 }).map(() => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    //address: faker.address.streetAddress(),
    password: faker.internet.password(),
    avatar: faker.system.commonFileName('jpg'),
    roleId: 3

  }
})


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
