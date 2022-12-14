'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: 'roleId' });
      User.hasMany(models.Transaction, { foreignKey: 'originUserId', as: 'origin' });
      User.hasMany(models.Transaction, { foreignKey: 'destinationUserId', as: 'destination' });
    }
  }

  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      address: DataTypes.STRING,
      avatar: DataTypes.STRING,
      roleId: DataTypes.INTEGER,
      status: {
        type: DataTypes.ENUM('active', 'blocked'),
        default: 'active'
      },
      balance: DataTypes.DECIMAL(10, 2)
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'User'
    }
  );

  return User;
};
