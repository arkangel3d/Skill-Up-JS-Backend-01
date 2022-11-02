const { User } = require('../database/models');

const checkUserEmail = async (req, res, next) => {
  const { email } = req.body;
  const emailFound = await User.findOne({ where: { email } });

  if (!emailFound) {
    return res.status(404).json({
      status: false,
      code: 404,
      message: 'No existe un usuario con ese email.'
    });
  }

  next();
};

module.exports = checkUserEmail;
