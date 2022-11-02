'use strict';
const { faker } = require('@faker-js/faker');


const users = Array.from({ length: 50 }).map(() => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    address: faker.address.streetAddress(),
    password: "$2a$10$d/lnn7UZrdJ2ltfM5QMZkumOrghswpLGerfXLmIcko8cbxU7vHGYy",
    avatar: faker.system.commonFileName('jpg'),
    roleId: 3

  }
})

const externalAgentUser = {

  firstName: "extusr",
  lastName: "extusr",
  email: "ext@usr.com",
  password: "$2a$10$d/lnn7UZrdJ2ltfM5QMZkumOrghswpLGerfXLmIcko8cbxU7vHGYy",
  roleId: 1


}


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [externalAgentUser, ...users], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
