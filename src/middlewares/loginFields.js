const { User } = require('../database/models');
const bcrypt = require('../helpers/bcrypt');

const loginFileds = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({
      message: 'El campo email es obligatorio.'
    });
  }

  if (!password) {
    return res.status(400).json({
      tatus: false,
      code: 400,
      message: 'El campo password es obligatorio.'
    });
  }

  let user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(400).json({
      tatus: false,
      code: 400,
      message: 'No existe un usuario con ese correo electrónico.'
    });
  }
  user = user.dataValues;

  const hashedPassword = user.password;
  if (!bcrypt.compare(password, hashedPassword)) {
    return res.status(403).json({
      status: false,
      code: 403,
      message: 'Contraseña inválida.'
    });
  }

  delete user.password;

  req.body.user = user;

  next();
};

module.exports = loginFileds;
