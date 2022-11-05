const createHttpError = require('http-errors');
const { User } = require('../database/models');
const { endpointResponse } = require('../helpers/success');
const { catchAsync } = require('../helpers/catchAsync');
const bcrypt = require('../helpers/bcrypt');
const { Op } = require('sequelize');

const { ID_ROLE_EXTAGENCY, ID_ROLE_ADMIN } = require('../constanst/roles');

// example of a controller. First call the service, then build the controller method
module.exports = {
  get: catchAsync(async (req, res, next) => {
    const { id } = req.user;
    try {
      const { id, roleId } = req.user;
      if (roleId === ID_ROLE_EXTAGENCY || roleId === ID_ROLE_ADMIN) {
        const response = await User.findAll({
          where: {
            roleId: {
              [Op.gte]: roleId
            },
            id: {
              [Op.notBetween]: [id, id]
            }
          },
          attributes: ['id', 'firstName', 'lastName', 'email', 'password', 'address', 'avatar', 'balance', 'status', 'balance']
        });
        return endpointResponse({
          res,
          message: 'Lista de usuarios.',
          body: response
        });
      }
      const response = await User.findAll({
        where: {
          roleId: {
            [Op.gte]: roleId
          },
          id: {
            [Op.notBetween]: [id, id]
          },
          status: 'active'
        },
        attributes: ['id', 'firstName', 'lastName', 'avatar']

      });
      return endpointResponse({
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
      const ID_ROLE_USER = 3; // USER ID CORRESPONDIENTE AL ROL DE USUARIO
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
  }),
  edit: catchAsync(async (req, res, next) => {
    try {
      const { id } = req.params;
      const { firstName, lastName, password } = req.body;
      const hashedPassword = await bcrypt.hash(password);
      User.update({ firstName, lastName, password: hashedPassword }, { where: { id } });
      endpointResponse({
        res,
        message: 'Usuario editado.',
        body: {
          id,
          firstName,
          lastName,
          password: hashedPassword
        }
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error creating user] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  }),
  remove: catchAsync(async (req, res, next) => {
    try {
      const id = req.user.id;
      const response = await User.destroy({ where: { id } });
      endpointResponse({
        res,
        message: 'Usuario eliminado.',
        body: {
          response
        }
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, `[Error creating user] - [index - GET]: ${error.message}`);
      next(httpError);
    }
  })
};
