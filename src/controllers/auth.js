const createHttpError = require('http-errors');
const { endpointResponse } = require('../helpers/success');
const { catchAsync } = require('../helpers/catchAsync');
const jwt = require('../helpers/jwt');
const { User } = require('../database/models');

// example of a controller. First call the service, then build the controller method
module.exports = {
  login: catchAsync(async (req, res, next) => {
    try {
      const { user } = req;
      const { password, balance, createdAt, updatedAt, ...rest } = user;
      const token = jwt.sign(user);
      endpointResponse({
        res,
        message: 'Login exitoso.',
        body: {
          user: rest,
          token
        }
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error creating user] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  }),
  me: catchAsync(async (req, res, next) => {
    try {
      let user = await User.findByPk(req.user.id);
      user = user.dataValues;
      const { createdAt, updatedAt, iat, password, ...rest } = user;
      endpointResponse({
        res,
        message: 'Tus datos de perfil.',
        body: {
          ...rest
        }
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error creating user] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  })
};
