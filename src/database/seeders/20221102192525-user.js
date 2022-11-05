'use strict';
const { faker } = require('@faker-js/faker');

const users = Array.from({ length: 22 }).map(() => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email().toLocaleLowerCase(),
    address: faker.address.streetAddress(),
    password: '$2a$10$d/lnn7UZrdJ2ltfM5QMZkumOrghswpLGerfXLmIcko8cbxU7vHGYy',
    avatar: faker.system.commonFileName('jpg'),
    roleId: 3,
    status: 'active',
    balance: 0
  };
});

const externalAgentUser = {
  firstName: 'Dios',
  lastName: 'García',
  email: 'ext@usr.com',
  password: '$2a$10$d/lnn7UZrdJ2ltfM5QMZkumOrghswpLGerfXLmIcko8cbxU7vHGYy',
  roleId: 1,
  status: 'active',
  balance: 1000000
};

const userOne = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'uno@mail.com',
  password: '$2a$10$d/lnn7UZrdJ2ltfM5QMZkumOrghswpLGerfXLmIcko8cbxU7vHGYy',
  roleId: 3,
  status: 'active',
  balance: 10000
};

const userTwo = {
  firstName: 'jane',
  lastName: 'Doe',
  email: 'dos@mail.com',
  password: '$2a$10$d/lnn7UZrdJ2ltfM5QMZkumOrghswpLGerfXLmIcko8cbxU7vHGYy',
  roleId: 3,
  status: 'active',
  balance: 20000
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [externalAgentUser, userOne, userTwo, ...users], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
