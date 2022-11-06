const hasCategoryType = async (req, res, next) => {
  const { type } = req.body;
  console.log(type)

  if (!type) {
    return res.status(404).json({
      status: false,
      code: 404,
      message: 'Es necesario un tipo de categoría.'
    });
  }

  next();
};

module.exports = hasCategoryType;