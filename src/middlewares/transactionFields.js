const { Category, User } = require('../database/models');
const { ID_ROLE_EXTAGENCY } = require('../constanst/roles');

const transactionsFields = async (req, res, next) => {
  const originUserId = req.user.id;
  let { concept, amount, categoryId, destinationUserId } = req.body;
  const date = new Date().toString();
  amount = Number(amount);
  concept = concept || null;

  if (isNaN(amount)) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'El campo amount es obligatorio y debe ser un número.'
    });
  }

  const existOriginUserId = await User.findByPk(originUserId);

  /* ORIGEN == DESTINO --- CARGA DE SALDO */
  if (Number(originUserId) === Number(destinationUserId)) {
    console.log('*** CARGA DE SALDO ***');
    const existCategory = await Category.findByPk(2);
    req.transaction = {
      amount,
      origin: {
        id: existOriginUserId.id,
        firstName: existOriginUserId.firstName,
        lastName: existOriginUserId.lastName,
        balance: existOriginUserId.balance
      },
      destination: {
        id: existOriginUserId.id,
        firstName: existOriginUserId.firstName,
        lastName: existOriginUserId.lastName,
        balance: existOriginUserId.balance
      },
      category: {
        id: existCategory.id,
        name: existCategory.name,
        description: existCategory.description,
        type: existCategory.type
      },
      concept,
      date
    };

    return next();
  }

  /* ORIGEN != DESTINO && DESTINO != BANCO --- TRANFERENCIA */
  if (existOriginUserId.balance < amount) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'Saldo insuficiente.'
    });
  }

  if (Number(originUserId) !== Number(destinationUserId) && Number(destinationUserId) !== ID_ROLE_EXTAGENCY) {
    console.log('*** TRANSFERENCIA ***');
    const existDestinationUserId = await User.findByPk(destinationUserId);

    if (!existDestinationUserId || existDestinationUserId.status === 'blocked') {
      return res.status(400).json({
        status: false,
        code: 400,
        message: 'No existe el usuario.'
      });
    }

    const existCategory = await Category.findByPk(1);
    req.transaction = {
      amount,
      origin: {
        id: existOriginUserId.id,
        firstName: existOriginUserId.firstName,
        lastName: existOriginUserId.lastName,
        balance: existOriginUserId.balance
      },
      destination: {
        id: existDestinationUserId.id,
        firstName: existDestinationUserId.firstName,
        lastName: existDestinationUserId.lastName,
        balance: existDestinationUserId.balance
      },
      category: {
        id: existCategory.id,
        name: existCategory.name,
        description: existCategory.description,
        type: existCategory.type
      },
      concept,
      date
    };

    return next();
  }

  /* DESTINO == BANCO --- GASTO (de cualquier tipo) */
  console.log('*** GASTO ***');
  if (!categoryId) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'El campo categoryId es obligatorio.'
    });
  }

  const existCategory = await Category.findOne({
    where: {
      type: 'out',
      id: categoryId
    }
  });

  if (!existCategory) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'Categoría inválida.'
    });
  }

  const existDestinationUserId = await User.findByPk(1);

  req.transaction = {
    amount,
    origin: {
      id: existOriginUserId.id,
      firstName: existOriginUserId.firstName,
      lastName: existOriginUserId.lastName,
      balance: existOriginUserId.balance
    },
    destination: {
      id: existDestinationUserId.id,
      firstName: existDestinationUserId.firstName,
      lastName: existDestinationUserId.lastName,
      balance: existDestinationUserId.balance
    },
    category: {
      id: existCategory.id,
      name: existCategory.name,
      description: existCategory.description,
      type: existCategory.type
    },
    concept,
    date
  };

  next();
};

module.exports = transactionsFields;
