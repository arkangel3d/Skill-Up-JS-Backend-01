const createHttpError = require('http-errors');
const { Category, Transaction, User } = require('../database/models');
const { endpointResponse } = require('../helpers/success');
const { catchAsync } = require('../helpers/catchAsync');
const bcrypt = require('../helpers/bcrypt');
const { Op } = require('sequelize');

const { ID_ROLE_EXTAGENCY, ID_ROLE_ADMIN } = require('../constants/roles');
const calcExpensesDistribution = require('../helpers/calcExpensesDistribution');
const calcIncomes = require('../helpers/calcIncomes');

// example of a controller. First call the service, then build the controller method
module.exports = {
  get: catchAsync(async (req, res, next) => {
    try {
      const { id, roleId } = req.user;
      if (roleId === ID_ROLE_EXTAGENCY || roleId === ID_ROLE_ADMIN) {
        const response = await User.findAll({
          where: {
            roleId: {
              [Op.gte]: roleId
            },
            id: {
              [Op.notBetween]: [id, id]
            }
          },
          attributes: ['id', 'firstName', 'lastName', 'email', 'address', 'balance', 'status']
        });
        return endpointResponse({
          res,
          message: 'Lista de usuarios.',
          body: response
        });
      }
      const response = await User.findAll({
        where: {
          roleId: {
            [Op.gte]: roleId
          },
          id: {
            [Op.notBetween]: [id, id]
          },
          status: 'active'
        },
        attributes: ['id', 'firstName', 'lastName', 'avatar']
      });
      return endpointResponse({
        res,
        message: 'Lista de usuarios.',
        body: response
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error retrieving users] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  }),
  getById: catchAsync(async (req, res, next) => {
    try {
      const { id } = req.params;
      let transactions = await Transaction.findAll({
        where: {
          [Op.or]: [{ originUserId: id }, { destinationUserId: id }]
        },
        attributes: ['id', 'amount', 'concept', 'transactionDate'],
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'description', 'type']
          },
          {
            model: User,
            as: 'origin',
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: User,
            as: 'destination',
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        order: [['id', 'ASC']]
      });

      // SE MAPEA LA RESPUESTA PARA OBTENER "dataValues" Y LUEGO SE MAPEA PARA CONVERTIR "amount" EN NÚMERO (LLEGA COMO STRING)
      transactions = transactions.map((result) => result.dataValues).map((el) => ({ ...el, amount: Number(el.amount) }));

      // SE OBTIENE EL BALANCE DEL USUARIO
      const user = await User.findByPk(id);
      const balance = Number(user.balance);

      const { incomes, totalIncomes, incomesDistribution } = await calcIncomes(id, transactions);

      const { expenses, totalExpenses, expensesDistribution } = await calcExpensesDistribution(id, transactions);

      endpointResponse({
        res,
        message: 'Datalles del usuario y su lista de tus transacciones.',
        body: {
          balance,
          user,
          incomes: {
            amount: incomes.length,
            total: totalIncomes,
            details: incomes,
            distribution: incomesDistribution
          },
          expenses: {
            amount: expenses.length,
            total: totalExpenses,
            details: expenses,
            distribution: expensesDistribution
          },
          transactions: {
            amount: transactions.length,
            details: [
              ...incomes.map((income) => ({ ...income, flow: 'in' })), //le agrego un campo flow para saber si las transferencias van o vienen
              ...expenses.map((expense) => ({ ...expense, flow: 'out' }))
            ]
          }
        }
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error retrieving user's transactions] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  }),
  getByEmail: catchAsync(async (req, res, next) => {
    try {
      const response = req.user;
      endpointResponse({
        res,
        message: 'Usuario encontrado',
        body: response
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error retrieving user] - [Index - GET]: ${error.message}`);
      next(httpError);
    }
  }),
  create: catchAsync(async (req, res, next) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const avatar = req.body.avatar || null;
      const ID_ROLE_USER = 3; // USER ID CORRESPONDIENTE AL ROL DE USUARIO
      const hashedPassword = await bcrypt.hash(password);
      await User.create({ firstName, lastName, email, password: hashedPassword, avatar, roleId: ID_ROLE_USER });
      endpointResponse({
        res,
        message: 'Usuario creado.',
        body: {
          firstName,
          lastName,
          email,
          avatar
        }
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error creating user] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  }),
  edit: catchAsync(async (req, res, next) => {
    try {
      const { id } = req.params;
      const { firstName, lastName, password } = req.body;
      const hashedPassword = await bcrypt.hash(password);
      User.update({ firstName, lastName, password: hashedPassword }, { where: { id } });
      endpointResponse({
        res,
        message: 'Usuario editado.',
        body: {
          firstName,
          lastName
        }
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error creating user] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  }),
  remove: catchAsync(async (req, res, next) => {
    try {
      const id = req.user.id;
      const response = await User.destroy({ where: { id } });
      endpointResponse({
        res,
        message: 'Usuario eliminado.',
        body: {
          response
        }
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error creating user] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  }),
  block: catchAsync(async (req, res, next) => {
    try {
      const { id } = req.params;
      User.update({ status: 'blocked' }, { where: { id } });
      endpointResponse({
        res,
        message: 'Usuario bloqueado.'
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error creating user] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  }),
  unblock: catchAsync(async (req, res, next) => {
    try {
      const { id } = req.params;
      User.update({ status: 'active' }, { where: { id } });
      endpointResponse({
        res,
        message: 'Usuario desbloqueado.'
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error creating user] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  }),
  resetpassword: catchAsync(async (req, res, next) => {
    try {
      const { id } = req.params;
      const { password } = req.body;
      const hashedPassword = await bcrypt.hash(password);
      User.update({ password: hashedPassword }, { where: { id } });
      User.update({ status: 'active' }, { where: { id } });
      endpointResponse({
        res,
        message: 'Password reseteado.',
        body: {
          password
        }
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error creating user] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  })
};
