const checkEmail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // Formato de email válido

const emailIsValid = (req, res, next) => {
  let { email } = req.body;

  if (!email) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'El campo email es obligatorio.'
    });
  }

  email = email.toLowerCase();
  if (!checkEmail.test(email)) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'El campo email deber contener un correo electrónico válido.'
    });
  }

  next();
};

module.exports = emailIsValid;
