const createHttpError = require('http-errors');
const { Category } = require('../database/models');
const { endpointResponse } = require('../helpers/success');
const { catchAsync } = require('../helpers/catchAsync');
const { ID_ROLE_EXTAGENCY, ID_ROLE_ADMIN } = require('../constants/roles');

// example of a controller. First call the service, then build the controller method
module.exports = {
  get: catchAsync(async (req, res, next) => {
    try {
      const { roleId } = req.user;
      let response = await Category.findAll();
      if (Number(roleId) !== ID_ROLE_EXTAGENCY && roleId !== ID_ROLE_ADMIN) {
        console.log('NO SOS ADMIN');
        response = response.filter((el) => el.id > 2);
      }
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
  }),
  edit: catchAsync(async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      Category.update({ name, description }, { where: { id } });
      endpointResponse({
        res,
        message: 'Categoría editada.',
        body: {
          id,
          name,
          description
        }
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error editing category] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  }),
  remove: catchAsync(async (req, res, next) => {
    try {
      const { id } = req.params;
      const response = await Category.destroy({ where: { id } });
      endpointResponse({
        res,
        message: 'Categoría eliminada.',
        body: {
          response
        }
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error removing category] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  })
};
