const createHttpError = require('http-errors');
const { Role } = require('../database/models');
const { endpointResponse } = require('../helpers/success');
const { catchAsync } = require('../helpers/catchAsync');

module.exports = {
    get: catchAsync(async (req, res, next) => {
        try {
            const response = Role.findAll();
            endpointResponse({
                res,
                message: 'Lista de Roles',
                body: response
            });
        } catch (error) {
            const httpError = createHttpError(error.statusCode, `[Error retrieving role] - [index - GET]: ${error.message}`);
            next(httpError);
        }
    }),
    create: catchAsync(async (req, res, next) => {
        try {
            const { name, description } = req.body;
            await Role.create({ name, description });
            endpointResponse({
                res,
                message: "Rol creado",
                body: {
                    name,
                    description
                }
            })
        } catch (error) {
            const httpError = createHttpError(error.statusCode, `[Error creating role] - [index - GET]: ${error.message}`);
            next(httpError);
        }
    })
};
