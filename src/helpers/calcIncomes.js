const { Category } = require('../database/models');

const calcIncomes = async (id, transactions) => {
  try {
    let incomes = transactions.filter(
      (el) => el.category.type === 'in' || (el.category.type === 'transference' && el.destination.id === id)
    );
    const totalIncomes = incomes.reduce((acc, el) => acc + el.amount, 0);

    incomes = incomes.reverse();

    return { incomes, totalIncomes };
  } catch (error) {
    const httpError = createHttpError(error.statusCode, `[Error retrieving user's transactions] - [index - GET]: ${error.message}`);
    next(httpError);
  }
};

module.exports = calcIncomes;
