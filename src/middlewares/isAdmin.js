const { ID_ROLE_EXTAGENCY, ID_ROLE_ADMIN } = require('../constants/roles');

const isAdmin = (req, res, next) => {
  const { roleId } = req.user;

  if (roleId !== ID_ROLE_EXTAGENCY && roleId !== ID_ROLE_ADMIN) {
    return res.status(403).json({
      status: false,
      code: 403,
      message: 'Permisos insuficientes.'
    });
  }

  next();
};

module.exports = isAdmin;
