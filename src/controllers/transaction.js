const { catchAsync } = require('../helpers/catchAsync');
const { endpointResponse } = require('../helpers/success');
const { Op } = require('sequelize');
const { Transaction, Category, User } = require('../database/models');

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
    console.log(id);
    try {
      const response = await Transaction.findAll({
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
      endpointResponse({
        res,
        message: 'Lista de tus transacciones.',
        body: response
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
      if (origin.id !== destination.id) {
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
