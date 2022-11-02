const jwt = require('../helpers/jwt');

const isAdmin = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.split(' ')[1];
  const ID_ROLE_ADMIN = 1; // USER ID CORRESPONDIENTE AL ROL DE ADMIN

  if (jwt.decode(token).id_role !== ID_ROLE_ADMIN) {
    return res.status(403).json({
      status: false,
      code: 403,
      message: 'Permisos insuficientes.'
    });
  }

  next();
};

module.exports = isAdmin;
