const createHttpError = require('http-errors');
const { Category, User } = require('../database/models');
const { ID_ROLE_EXTAGENCY } = require('../constants/roles');

const transactionsFields = async (req, res, next) => {
  const originUserId = req.user.id;
  let { concept, amount, categoryId, destinationUserId } = req.body;
  const date = new Date().toString();
  amount = Number(amount);
  concept = concept || null;

  //TODO: validation!
  if (isNaN(amount)) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'El campo amount es obligatorio y debe ser un número.'
    });
  }
  if (isNaN(categoryId) && Number.isInteger(categoryId)) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'El campo categoryId es obligatorio y debe ser un número entero.'
    });
  }

  try {
    const {
      name: categoryName,
      type: categoryType,
      description: categoryDescription
    } = await Category.findByPk(categoryId)

    const existOriginUserId = await User.findByPk(originUserId);

    const categoryForReq = {
      id: categoryId,
      name: categoryName,
      description: categoryDescription,
      type: categoryType
    }

    // State machine --> Category type: e=expense, i=income, t=transfer

    if (categoryType === 't') {//TODO es lógica aparte
      console.log('*** TRANSFERENCIA ***');
      if (existOriginUserId.balance < amount) {
        return res.status(400).json({
          status: false,
          code: 400,
          message: 'Saldo insuficiente.'
        });
      }
      const existDestinationUserId = await User.findByPk(destinationUserId);

      if (!existDestinationUserId || existDestinationUserId.status === 'blocked') {
        return res.status(400).json({
          status: false,
          code: 400,
          message: 'No existe el usuario.'
        });
      }

      if (existDestinationUserId.id === existOriginUserId.id) {
        return res.status(400).json({
          status: false,
          code: 400,
          message: 'El usuario destino debe ser diferente al usuario origen.'
        });
      }
      if (
        existDestinationUserId.id === 1 ||
        !existDestinationUserId ||
        existDestinationUserId.status === 'blocked'
      ) {
        return res.status(400).json({
          status: false,
          code: 400,
          message: 'No existe el usuario.'
        });
      }
      req.transaction = {
        amount,
        origin: {
          id: existOriginUserId.id,
          firstName: existOriginUserId.firstName,
          lastName: existOriginUserId.lastName,
          balance: existOriginUserId.balance
        },
        destination: {
          id: existDestinationUserId.id,
          firstName: existDestinationUserId.firstName,
          lastName: existDestinationUserId.lastName,
          balance: existDestinationUserId.balance
        },
        category: categoryForReq,
        concept,
        date
      };

      return next();
    }

    //carga o gasto
    const externalAgent = await User.findByPk(1); // every source or money destination that's outside the wallet

    if (categoryType === 'i') {
      console.log('*** CARGA DE SALDO ***');
      req.transaction = {
        amount,
        origin: {
          id: externalAgent.id,
          firstName: externalAgent.firstName,
          lastName: null,
          balance: externalAgent.balance
        },
        destination: {
          id: existOriginUserId.id,
          firstName: existOriginUserId.firstName,
          lastName: existOriginUserId.lastName,
          balance: existOriginUserId.balance
        },
        category: categoryForReq,
        concept,
        date
      };

      return next();
    }

    if (categoryType === 'e') {
      console.log('*** GASTO ***');
      if (existOriginUserId.balance < amount) {
        return res.status(400).json({
          status: false,
          code: 400,
          message: 'Saldo insuficiente.'
        });
      }
      req.transaction = {
        amount,
        origin: {
          id: existOriginUserId.id,
          firstName: existOriginUserId.firstName,
          lastName: existOriginUserId.lastName,
          balance: existOriginUserId.balance
        },
        destination: {
          id: externalAgent.id,
          firstName: externalAgent.firstName,
          lastName: null,
          balance: externalAgent.balance
        },
        category: categoryForReq,
        concept,
        date
      };

      next();
    }


  } catch (error) {
    const httpError = createHttpError(error.statusCode, `[Error retrieving transaction category] - [transaction create - POST]: ${error.message}`);
    next(httpError);
  }

  next();
};

module.exports = transactionsFields;
