const createHttpError = require('http-errors');
const { User } = require('../database/models');
const { endpointResponse } = require('../helpers/success');
const { catchAsync } = require('../helpers/catchAsync');

// example of a controller. First call the service, then build the controller method
module.exports = {
  get: catchAsync(async (req, res, next) => {
    try {
      const response = await User.findAll();
      endpointResponse({
        res,
        message: 'Lista de usuarios.',
        body: response
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error retrieving users] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  }),
  create: catchAsync(async (req, res, next) => {
    try {
      const { firstName, lastName, email } = req.body;
      const avatar = req.body.avatar || null;
      const ID_ROLE_USER = 2; // USER ID CORRESPONDIENTE AL ROL DE USUARIO
      await User.create({ firstName, lastName, email, avatar, roleId: ID_ROLE_USER });
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
  })
};
