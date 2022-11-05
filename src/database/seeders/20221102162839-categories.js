'use strict';

const categories = [
  // i: income, e: expense, t: transfer
  {
    name: 'Transferencia',
    type: 'transference',
    description: 'Transferencia'
  },
  {
    name: 'Carga de saldo',
    type: 'in',
    description: 'Carga de saldo'
  },
  {
    name: 'Alguiler',
    type: 'out',
    description: 'Gastos de alquiler'
  },
  {
    name: 'Supermercado',
    type: 'out',
    description: 'Compra en el supermercado.'
  }
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', categories, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', null, {});
  }
};
