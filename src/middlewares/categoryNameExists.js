const { Category } = require('../database/models');

const categoryNameExists = async (req, res, next) => {
  const { name } = req.body;
  const nameFound = await Category.findOne({ where: { name } });

  if (nameFound && Number(nameFound?.id) !== Number(req.params.id)) {
    return res.status(404).json({
      status: false,
      code: 404,
      message: 'Ya existe una categoría con ese nombre.'
    });
  }

  next();
};

module.exports = categoryNameExists;
