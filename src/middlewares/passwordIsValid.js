const checkPassword = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[#?!@$%^&*-]).{8,50}/; // Al menos una letra mayúscula, una minúscula, un número y un caracter especial. Longitud entre 8 y 50 caracteres

const passwordIdValid = (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'El campo password es obligatorio.'
    });
  }

  if (!checkPassword.test(password)) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'El campo password de tener un mínimo 8 caracteres, e incluir al menos una letra en mayúscula y un caracter especial.'
    });
  }

  next();
};

module.exports = passwordIdValid;
