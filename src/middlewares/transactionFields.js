const createHttpError = require('http-errors');
const { Category, User } = require('../database/models');
const { ID_ROLE_EXTAGENCY } = require('../constants/roles');

const transactionsFields = async (req, res, next) => {
  const originUserId = req.user.id;
  let { concept, amount, categoryId, destinationUserId } = req.body;
  const date = Date.now()
  amount = Number(amount);
  concept = concept || null;

  //TODO: validation!
  const validationErrors = []

  try {
    if (isNaN(amount)) validationErrors.push('El campo amount es obligatorio y debe ser un número.');

    if (isNaN(categoryId) || !Number.isInteger(categoryId)) validationErrors.push('El campo categoryId es obligatorio y debe ser un número entero.');

    if (validationErrors.length > 0) throw new Error;

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

    // State machine --> Category type: out=expense, in=income, transference

    if (categoryType === 'transference') {// TRANFERS
      if (existOriginUserId.balance < amount) validationErrors.push('Saldo insuficiente');

      const existDestinationUserId = await User.findByPk(destinationUserId); // Existe usuario destino?

      if (!existDestinationUserId || existDestinationUserId.status === 'blocked') validationErrors.push('No existe el usuario.');

      if (existDestinationUserId.id === existOriginUserId.id) validationErrors.push('El usuario destino debe ser diferente al usuario origen.');

      if (!existDestinationUserId || existDestinationUserId.id === 1 || existDestinationUserId.status === 'blocked'
      ) validationErrors.push('No existe el usuario.');


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
      if (validationErrors.length > 0) throw new Error
      return next();
    }

    //carga o gasto
    const externalAgent = await User.findByPk(1); // every source or money destination that's outside the wallet

    if (categoryType === 'in') { // INCOMES
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

      if (validationErrors.length > 0) throw new Error
      return next();
    }

    if (categoryType === 'out') { // EXPENSES
      if (existOriginUserId.balance < amount) validationErrors.push('Saldo insuficiente');

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

      if (validationErrors.length > 0) throw new Error
      return next();
    }


  } catch (error) {
    if (validationErrors.length > 0) {
      res.status(400).json({
        status: false,
        code: 400,
        message: validationErrors.join('\n')
      });
      delete validationErrors;
      return;
    }
    const httpError = createHttpError(error.statusCode, `[Error retrieving transaction category] - [transaction create - POST]: ${error.message}`);
    next(httpError);
  }
};

module.exports = transactionsFields;
