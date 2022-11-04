const { Category, Transaction, User } = require('../database/models');
const { ID_ROLE_EXTAGENCY, ID_ROLE_ADMIN } = require('../constanst/roles');

const userHasAccessToUpdateTransaction = async (req, res, next) => {
  const { user } = req;
  const { concept } = req.body;
  console.log(concept);

  let { id } = req.params;
  id = Number(id);

  const idToken = user.id;
  const roleToken = user.roleId;

  if (!concept) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'El campo concept es obligatorio.'
    });
  }

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

  if (!transaction) {
    return res.status(404).json({
      status: false,
      code: 404,
      message: 'No existe la transacción.'
    });
  }

  const origin = transaction.origin.id;

  if (roleToken === ID_ROLE_EXTAGENCY || roleToken === ID_ROLE_ADMIN) {
    return next();
  }

  if (idToken !== origin) {
    return res.status(403).json({
      status: false,
      code: 403,
      message: 'No tienes permisos para acceder.'
    });
  }

  next();
};

module.exports = userHasAccessToUpdateTransaction;
