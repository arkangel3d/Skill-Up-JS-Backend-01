'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
      Transaction.belongsTo(models.User, { foreignKey: 'originUserId', as: 'origin' });
      Transaction.belongsTo(models.User, { foreignKey: 'destinationUserId', as: 'destination' });
    }
  }
  Transaction.init(
    {
      concept: DataTypes.STRING,
      amount: DataTypes.DECIMAL(10, 2),
      transactionDate: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      originUserId: DataTypes.INTEGER,
      destinationUserId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Transaction'
    }
  );
  return Transaction;
};
