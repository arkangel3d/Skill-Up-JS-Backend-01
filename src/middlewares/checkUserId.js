const { User } = require('../database/models');

const checkUserId = async (req, res, next) => {
  const id = req.params.id;
  const idFound = await User.findByPk(id);

  if (!idFound) {
    return res.status(404).json({
      status: false,
      code: 404,
      message: 'No existe un usuario con ese id.'
    });
  }

  next();
};

module.exports = checkUserId;
