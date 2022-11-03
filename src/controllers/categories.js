const createHttpError = require('http-errors');
const { Category } = require('../database/models');
const { endpointResponse } = require('../helpers/success');
const { catchAsync } = require('../helpers/catchAsync');

// example of a controller. First call the service, then build the controller method
module.exports = {
  get: catchAsync(async (req, res, next) => {
    try {
      const response = await Category.findAll();
      endpointResponse({
        res,
        message: 'Lista de categorias.',
        body: response
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error retrieving categories] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  }),
  create: catchAsync(async (req, res, next) => {
    try {
      const { name, description, type } = req.body;
      await Category.create({ name, description, type });
      endpointResponse({
        res,
        message: 'Categoría creada.',
        body: {
          name,
          description,
          type
        }
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error creating category] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  })
};
