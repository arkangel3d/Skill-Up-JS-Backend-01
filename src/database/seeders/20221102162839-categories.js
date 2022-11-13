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
    name: 'Alquiler',
    type: 'out',
    description: 'Gastos de alquiler'
  },
  {
    name: 'Supermercado',
    type: 'out',
    description: 'Compra en el supermercado.'
  },
  {
    name: 'Servicios',
    type: 'out',
    description: 'Gasto en servicios (electricidad, gas, internet, etc.).'
  },
  {
    name: 'Impuestos',
    type: 'out',
    description: 'Gasto en impuestos públicos.'
  },
  {
    name: 'Prepaga',
    type: 'out',
    description: 'Gasto en obra social prepaga.'
  },
  {
    name: 'Vestimenta',
    type: 'out',
    description: 'Gasto en vestimenta.'
  },
  {
    name: 'Transporte',
    type: 'out',
    description: 'Gasto en transporte público.'
  },
  {
    name: 'Otros gastos',
    type: 'out',
    description: 'Gasto tipo de gasto.'
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
