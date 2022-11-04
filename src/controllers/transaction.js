const { Transaction, Category, User } = require('../database/models');
const { endpointResponse } = require('../helpers/success');
const { catchAsync } = require('../helpers/catchAsync');
const { Op } = require('sequelize');

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
        ]
      });
      endpointResponse({
        res,
        message: 'Lista de transacciones todos los usuarios',
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
        message: 'Lista de transacciones todos los usuarios',
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
        ]
      });
      endpointResponse({
        res,
        message: 'Lista de tus transacciones',
        body: response
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error retrieving user's transactions] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  }),
  create: catchAsync(async (req, res, next) => {
    try {
      /*  const { concept, amount, transactionDate, categoryId } = req.body;
      const originUserId = req.body.originUserId || null;
      const destinationUserId = req.body.destinationUserId || null;
      await Transaction.create({ concept, amount, transactionDate, categoryId }); */
      endpointResponse({
        res,
        message: 'Transaccion creada',
        body: {}
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error creating transaction] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  })
};
