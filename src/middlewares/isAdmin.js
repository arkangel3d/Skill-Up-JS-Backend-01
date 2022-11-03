const jwt = require('../helpers/jwt');

const isAdmin = (req, res, next) => {
  console.log(req.user)
  const { roleId } = req.user;
  const ID_ROLE_EXTAGENCY = 1; // USER ID CORRESPONDIENTE AL ROL DE EXT-AGENCY
  const ID_ROLE_ADMIN = 2; // USER ID CORRESPONDIENTE AL ROL DE ADMIN

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
