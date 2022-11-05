const { Category } = require('../database/models');

const calExpensesDistribution = async (id, transactions) => {
  try {
    // SE CALCULAN LOS GASTOS (INCLUYE TRANSFERENCIAS REALIZADAS)
    const expenses = transactions.filter(
      (el) => el.category.type === 'out' || (el.category.type === 'transference' && el.origin.id === id)
    );

    const totalExpenses = expenses.reduce((acc, el) => acc + el.amount, 0);

    const categoriesIds = Array.from(new Set(expenses.map((el) => el.category.id)));

    let categories = await Category.findAll({
      attributes: ['id', 'name']
    });
    categories = categories.map((result) => result.dataValues);

    const expensesDistribution = categoriesIds
      .map((el) => {
        return transactions.filter((tra) => tra.category.id === el).reduce((acc, act) => acc + act.amount, 0);
      })
      .map((element, idx) => ({
        id: idx + 1,
        name: categories.find((el) => el.id === categoriesIds[idx]).name,
        total: element,
        percentage: (element / totalExpenses) * 100
      }));

    return { expenses, totalExpenses, expensesDistribution };
  } catch (error) {
    const httpError = createHttpError(error.statusCode, `[Error retrieving user's transactions] - [index - GET]: ${error.message}`);
    next(httpError);
  }
};

module.exports = calExpensesDistribution;
