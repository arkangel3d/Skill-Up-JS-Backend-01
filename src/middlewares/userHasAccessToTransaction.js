const jwt = require('../helpers/jwt');

const { Category, Transaction, User } = require('../database/models');

const userHasAccessToTransaction = async (req, res, next) => {
  const { user } = req;

  let { id } = req.params;
  id = Number(id);

  const idToken = user.id;
  const roleToken = user.roleId;

  const ID_ROLE_EXTAGENCY = 1; // USER ID CORRESPONDIENTE AL ROL DE EXT-AGENCY
  const ID_ROLE_ADMIN = 2; // USER ID CORRESPONDIENTE AL ROL DE ADMIN

  // const transaction = await Transaction.findByPk(id);
  const transaction = await Transaction.findByPk(id, {
    attributes: ['id', 'amount', 'concept', 'transactionDate'],
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'description', 'type']
      },
      {
        model: User,
        as: 'origin',
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: User,
        as: 'destination',
        attributes: ['id', 'firstName', 'lastName']
      }
    ]
  });

  const origin = transaction.origin.id;
  const destination = transaction.destination.id;

  req.transaction = transaction;

  if (roleToken === ID_ROLE_EXTAGENCY || roleToken === ID_ROLE_ADMIN) {
    return next();
  }

  if (idToken !== origin && idToken !== destination) {
    return res.status(403).json({
      status: false,
      code: 403,
      msg: 'No tienes permisos para acceder.'
    });
  }

  next();
};

module.exports = userHasAccessToTransaction;
