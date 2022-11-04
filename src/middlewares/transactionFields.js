const { Category, User } = require('../database/models');

const transactionsFields = async (req, res, next) => {
  let { concept, amount, categoryId, originUserId, destinationUserId } = req.body;

  amount = Number(amount);
  concept = concept || null;

  if (isNaN(amount)) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'El campo amount es obligatorio y debe ser un número.'
    });
  }

  if (!categoryId) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'El campo categoryId es obligatorio.'
    });
  }

  const existCategory = await Category.findByPk(categoryId);
  if (!existCategory) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'No existe categoryId.'
    });
  }

  if (!originUserId) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'El campo originUserId es obligatorio.'
    });
  }

  const existOriginUserId = await User.findByPk(originUserId);
  if (!existOriginUserId) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'No existe originUserId.'
    });
  }

  if (existOriginUserId.balance < amount) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'Fondos insuficientes.'
    });
  }

  if (!destinationUserId) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'El campo destinationUserId es obligatorio.'
    });
  }

  const existDestinationUserId = await User.findByPk(destinationUserId);
  if (!existDestinationUserId) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'No existe destinationUserId.'
    });
  }

  const transactionDate = new Date();

  req.transaction = {
    amount,
    originUserId,
    destinationUserId,
    categoryId,
    concept,
    transactionDate
  };

  next();
};

module.exports = transactionsFields;
