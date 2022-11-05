const { ID_ROLE_EXTAGENCY, ID_ROLE_ADMIN } = require('../constants/roles');

const userHasAccess = (req, res, next) => {
  const { user } = req;

  let { id } = req.params;
  id = Number(id);

  const idToken = user.id;
  const roleToken = user.roleId;

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
