const { Transaction } = require('../database/models');
const { endpointResponse } = require('../helpers/success');
const { catchAsync } = require('../helpers/catchAsync');
const { Op } = require('sequelize');

// example of a controller. First call the service, then build the controller method
module.exports = {
    get: catchAsync(async (req, res, next) => {
        try {
            const { id } = req.user;
            const response = await Transaction.findAll({ where: { id } });
            endpointResponse({
                res,
                message: "Lista de transacciones del usuario",
                body: response
            })
        } catch (error) {
            const httpError = createHttpError(error.statusCode, `[Error retrieving user's transactions] - [index - GET]: ${error.message}`);
            next(httpError);
        }
    }),
    create: catchAsync(async (req, res, next) => {
        try {
            const { concept, amount, transactionDate, categoryId } = req.body;
            const originUserId = req.body.originUserId || null;
            const destinationUserId = req.body.destinationUserId || null;
            await Transaction.create({ concept, amount, transactionDate, categoryId });
            endpointResponse({
                res,
                message: "Transaccion creada",
                body: {
                    concept,
                    amount,
                    transactionDate,
                    categoryId,
                    originUserId,
                    destinationUserId
                }
            })
        } catch (error) {
            const httpError = createHttpError(error.statusCode, `[Error creating transaction] - [index - GET]: ${error.message}`);
            next(httpError);
        }
    }),
}