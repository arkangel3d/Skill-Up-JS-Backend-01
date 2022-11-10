const { catchAsync } = require('../helpers/catchAsync');
const { endpointResponse } = require('../helpers/success');
const { Op } = require('sequelize');
const { Transaction, Category, User } = require('../database/models');
const createHttpError = require('http-errors');
const calcExpensesDistribution = require('../helpers/calcExpensesDistribution');
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
    try {
      const { id } = req.user;
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
      transactions = transactions
        .map((result) => result.dataValues)
        .map((el) => ({ ...el, amount: Number(el.amount) }))
        .sort((a, b) => Number(a.id) - Number(b.id));

      // SE OBTIENE EL BALANCE DEL USUARIO
      const user = await User.findByPk(id, {
        attributes: ['balance']
      });
      const balance = Number(user.balance);

      const { incomes, totalIncomes } = await calcIncomes(id, transactions);

      const { expenses, totalExpenses, expensesDistribution } = await calcExpensesDistribution(id, transactions);

      const transactionsWithFlow = [
        ...incomes.map((income) => ({ ...income, flow: 'in' })),
        ...expenses.map((expense) => ({ ...expense, flow: 'out' }))
      ].sort((a, b) => b.id - a.id);

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
            distribution: expensesDistribution
          },
          transactions: {
            amount: transactions.length,
            details: transactionsWithFlow
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

      let message = 'Gasto cargado.';
      if (category.id === 1) message = 'Transferencia exitosa.';
      if (category.id === 2) message = 'Recarga exitosa.';

      endpointResponse({
        res,
        message,
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
