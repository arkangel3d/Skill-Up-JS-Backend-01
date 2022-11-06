const categoryTypeValid = async (req, res, next) => {
    const { type } = req.body;
    const validTypes = ['in', 'out', 'transference']
    const included = (element) => element.includes(type)
  
    if (!validTypes.some(included)) {
      return res.status(404).json({
        status: false,
        code: 404,
        message: 'Tipo de categoría inválido.'
      });
    }
  
    next();
  };
  
  module.exports = categoryTypeValid;