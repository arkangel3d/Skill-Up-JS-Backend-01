const { User } = require('../database/models');

const checkUserId = async (req, res, next) => {
  const id = req.params.id;
  const roleId = req.roleId;

  const user = await User.findByPk(id);

  if (!user || user?.roleId < roleId) {
    return res.status(404).json({
      status: false,
      code: 404,
      message: 'No existe un usuario con ese id.'
    });
  }

  req.user = user;

  next();
};

module.exports = checkUserId;
