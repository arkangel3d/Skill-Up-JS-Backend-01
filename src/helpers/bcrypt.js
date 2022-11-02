const bcryptjs = require('bcryptjs');

const bcrypt = {};
bcrypt.hash = async (password) => {
  const salt = await bcryptjs.genSalt(10);

  return await bcryptjs.hash(password, salt);
};

bcrypt.compare = async (passwordOne, passwordTwo) => {
  return await bcryptjs.compare(passwordOne, passwordTwo);
};

module.exports = bcrypt;
