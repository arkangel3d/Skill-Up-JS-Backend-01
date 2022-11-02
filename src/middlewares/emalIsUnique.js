const { User } = require('../database/models');

const emailIsUnique = async (req, res, next) => {
  const { email } = req.body;
  const userAlreadyExist = await User.findOne({ where: { email } });

  if (userAlreadyExist) {
    return res.status(403).json({
      status: false,
      code: 403,
      message: 'Ya existe un usuario con ese email.'
    });
  }

  next();
};

module.exports = emailIsUnique;
