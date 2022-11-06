const { Category } = require('../database/models');

const checkCategoryId = async (req, res, next) => {
  const { id } = req.params;
  const idFound = await Category.findOne({ where: {id} });

  if (!idFound) {
    return res.status(404).json({
      status: false,
      code: 404,
      message: 'No existe categoría con ese id.'
    });
  }

  next();
};

module.exports = checkCategoryId;