const jwt = require('../helpers/jwt');

const isAdmin = (req, res, next) => {
  const userRole = req.user.roleId;
  const ID_ROLE_EXTAGENCY = 1; // USER ID CORRESPONDIENTE AL ROL DE EXT-AGENCY
  const ID_ROLE_ADMIN = 2; // USER ID CORRESPONDIENTE AL ROL DE ADMIN

  if (userRole !== ID_ROLE_EXTAGENCY && userRole !== ID_ROLE_ADMIN) {
    return res.status(403).json({
      status: false,
      code: 403,
      message: 'Permisos insuficientes.'
    });
  }

  next();
};

module.exports = isAdmin;
