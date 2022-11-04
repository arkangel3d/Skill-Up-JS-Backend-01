const { Category, Transaction, User } = require('../database/models');
const { ID_ROLE_EXTAGENCY, ID_ROLE_ADMIN } = require('../constanst/roles');

const userHasAccessToViewTransaction = async (req, res, next) => {
  const { user } = req;

  let { id } = req.params;
  id = Number(id);

  const idToken = user.id;
  const roleToken = user.roleId;

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
    ],
    order: [['id', 'DESC']]
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

module.exports = userHasAccessToViewTransaction;
