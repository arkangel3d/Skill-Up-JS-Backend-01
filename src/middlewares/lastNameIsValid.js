const checkName = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1 ]{2,50}$/; // Letras mayúsculas y minúsculas, y espacios. Longitud entre 3 y 50 caracteres

const lastNameIsValid = (req, res, next) => {
  const { lastName } = req.body;

  if (!lastName) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'El campo lastName es obligatorio.'
    });
  }

  if (!checkName.test(lastName)) {
    return res.status(400).json({
      status: false,
      code: 400,
      message:
        'El campo lastName debe tener al menos 4 caracteres, no más de 50, y no debe contener números ni caracteres especiales, salvo espacios.'
    });
  }

  next();
};

module.exports = lastNameIsValid;
