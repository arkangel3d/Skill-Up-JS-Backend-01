const { User } = require('../database/models');

const checkUserEmail = async (req, res, next) => {
  const email = req.params.email;
  const roleId = req.roleId;
  const user = await User.findOne({ where: { email } });

  if (!user || user?.roleId < roleId) {
    return res.status(404).json({
      status: false,
      code: 404,
      message: 'No existe un usuario con ese email.'
    });
  }

  req.user = user;

  next();
};

module.exports = checkUserEmail;
