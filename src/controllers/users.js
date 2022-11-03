const createHttpError = require('http-errors');
const { User } = require('../database/models');
const { endpointResponse } = require('../helpers/success');
const { catchAsync } = require('../helpers/catchAsync');
const bcrypt = require('../helpers/bcrypt');
const { where, Op } = require('sequelize');

// example of a controller. First call the service, then build the controller method
module.exports = {
  get: catchAsync(async (req, res, next) => {
    try {
      const roleId = req.user.roleId;
      const response = await User.findAll({
        where: {
          roleId: {
            [Op.gte]: roleId
          }
        }
      });
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
  getById: catchAsync(async (req, res, next) => {
    try {
      const response = req.user;
      endpointResponse({
        res,
        message: 'Usuario encontrado',
        body: response
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error retrieving user] - [Index - GET]: ${error.message}`);
      next(httpError);
    }
  }),
  getByEmail: catchAsync(async (req, res, next) => {
    try {
      const response = req.user;
      endpointResponse({
        res,
        message: 'Usuario encontrado',
        body: response
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error retrieving user] - [Index - GET]: ${error.message}`);
      next(httpError);
    }
  }),
  create: catchAsync(async (req, res, next) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const avatar = req.body.avatar || null;
      const ID_ROLE_USER = 2; // USER ID CORRESPONDIENTE AL ROL DE USUARIO
      const hashedPassword = await bcrypt.hash(password);
      await User.create({ firstName, lastName, email, password: hashedPassword, avatar, roleId: ID_ROLE_USER });
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
