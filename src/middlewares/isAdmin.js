const jwt = require('../helpers/jwt');

const isAdmin = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.split(' ')[1];

  if (jwt.decode(token).id_role !== 1) {
    return res.status(403).json({
      message: 'Permisos insuficientes.'
    });
  }

  next();
};

module.exports = isAdmin;
