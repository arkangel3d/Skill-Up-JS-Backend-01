const jwt = require('../helpers/jwt');

const userHasAccess = (req, res, next) => {
  const { user } = req;

  let { id } = req.params;
  id = Number(id);

  const idToken = user.id;
  const roleToken = user.roleId;

  const ID_ROLE_EXTAGENCY = 1; // USER ID CORRESPONDIENTE AL ROL DE EXT-AGENCY
  const ID_ROLE_ADMIN = 2; // USER ID CORRESPONDIENTE AL ROL DE ADMIN

  if (roleToken !== ID_ROLE_EXTAGENCY && roleToken !== ID_ROLE_ADMIN && id !== idToken) {
    return res.status(401).json({
      status: false,
      code: 403,
      msg: 'No tienes permisos para acceder.'
    });
  }

  next();
};

module.exports = userHasAccess;
