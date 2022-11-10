const { Category } = require('../database/models');

const calcIncomes = async (id, transactions) => {
  try {
    let incomes = transactions.filter(
      (el) => el.category.type === 'in' || (el.category.type === 'transference' && el.destination.id === Number(id))
    );
    const totalIncomes = incomes.reduce((acc, el) => acc + el.amount, 0);

    const categoriesIds = Array.from(new Set(incomes.map((el) => el.category.id)));

    let categories = await Category.findAll({
      attributes: ['id', 'name']
    });

    categories = categories.map((result) => result.dataValues);

    const incomesDistribution = categoriesIds
      .map((el) => {
        return incomes.filter((tra) => tra.category.id === el).reduce((acc, act) => acc + act.amount, 0);
      })
      .map((element, idx) => ({
        id: idx + 1,
        name: categories.find((el) => el.id === categoriesIds[idx]).name,
        total: element,
        percentage: (element / totalIncomes) * 100
      }));

    incomes = incomes.reverse();

    return { incomes, totalIncomes, incomesDistribution };
  } catch (error) {
    const httpError = createHttpError(error.statusCode, `[Error retrieving user's transactions] - [index - GET]: ${error.message}`);
    next(httpError);
  }
};

module.exports = calcIncomes;
