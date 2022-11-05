const { Op } = require('sequelize');

const { User } = require('../database/models');
const { ID_ROLE_EXTAGENCY, ID_ROLE_ADMIN } = require('../constanst/roles');

const checkUserEmail = async (req, res, next) => {
  const { email } = req.params;
  const { roleId } = req.user;

  if (roleId === ID_ROLE_EXTAGENCY || roleId === ID_ROLE_ADMIN) {
    const user = await User.findOne({
      where: {
        email
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'password', 'address', 'avatar', 'balance', 'status', 'balance']
    });

    req.user = user;

    return next();
  }

  const user = await User.findOne({
    where: {
      email,
      roleId: {
        [Op.gte]: roleId
      },
      status: 'active'
    },
    attributes: ['id', 'firstName', 'lastName', 'roleId', 'status']
  });

  if (!user || user?.roleId < roleId) {
    return res.status(404).json({
      status: false,
      code: 404,
      message: 'No existe un usuario con ese email.'
    });
  }

  req.user = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    satus: user.status
  };

  next();
};

module.exports = checkUserEmail;
