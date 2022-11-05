const { catchAsync } = require('../helpers/catchAsync');
const { endpointResponse } = require('../helpers/success');
const { Op } = require('sequelize');
const { Transaction, Category, User } = require('../database/models');
const createHttpError = require('http-errors');
const calExpensesDistribution = require('../helpers/calcExpensesDistribution');
const calcIncomes = require('../helpers/calcIncomes');

// example of a controller. First call the service, then build the controller method
module.exports = {
  get: catchAsync(async (req, res, next) => {
    try {
      const response = await Transaction.findAll({
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
        order: [['id', 'DESC']]
      });
      endpointResponse({
        res,
        message: 'Lista de transacciones todos los usuarios.',
        body: response
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error retrieving user's transactions] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  }),
  getById: catchAsync(async (req, res, next) => {
    try {
      const response = req.transaction;

      endpointResponse({
        res,
        message: 'Transacción encontrada.',
        body: response
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error retrieving user's transactions] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  }),
  me: catchAsync(async (req, res, next) => {
    const { id } = req.user;
    try {
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
        order: [['id', 'DESC']]
      });

      // SE MAPEA LA RESPUESTA PARA OBTENER "dataValues" Y LUEGO SE MAPEA PARA CONVERTIR "amount" EN NÚMERO (LLEGA COMO STRING)
      transactions = transactions.map((result) => result.dataValues).map((el) => ({ ...el, amount: Number(el.amount) }));

      // SE OBTIENE EL BALANCE DEL USUARIO
      const user = await User.findByPk(id, {
        attributes: ['balance']
      });
      const balance = Number(user.balance);

      const { incomes, totalIncomes } = await calcIncomes(id, transactions);

      const { expenses, totalExpenses, expensesDistribution } = await calExpensesDistribution(id, transactions);
      endpointResponse({
        res,
        message: 'Lista de tus transacciones.',
        body: {
          balance,
          incomes: {
            amount: incomes.length,
            total: totalIncomes,
            details: incomes
          },
          expenses: {
            amount: expenses.length,
            total: totalExpenses,
            details: expenses,
            distriburion: expensesDistribution
          },
          transactions: {
            amount: transactions.length,
            details: transactions
          }
        }
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error retrieving user's transactions] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  }),
  create: catchAsync(async (req, res, next) => {
    try {
      const { amount, origin, destination, category, concept, date } = req.transaction;


      await Promise.all([
        Transaction.create({
          amount,
          originUserId: origin.id,
          destinationUserId: destination.id,
          categoryId: category.id,
          concept,
          transactionDate: date
        }),
        User.update({ balance: Number(destination.balance) + amount }, { where: { id: destination.id } })
      ]);
      if (origin.id !== 1) {
        await User.update({ balance: Number(origin.balance) - amount }, { where: { id: origin.id } });
      }
      endpointResponse({
        res,
        message: 'Transaccion creada.',
        body: {
          amount,
          origin: {
            id: origin.id,
            firstName: origin.firstName,
            lastName: origin.lastName
          },
          destination: {
            id: destination.id,
            firstName: destination.firstName,
            lastName: destination.lastName
          },
          category,
          concept,
          date
        }
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error creating transaction] - [index - GET]: ${error.message}`);
      next(httpError);
    }
    console.log(">>>>>>>>>>>>>>>>>>>>>entra aca?")
  }),
  update: catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { concept } = req.body;
    try {
      Transaction.update({ concept }, { where: { id } });
      endpointResponse({
        res,
        message: 'Transaccion actualizada.',
        body: {
          id,
          concept
        }
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error creating transaction] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  })
};
