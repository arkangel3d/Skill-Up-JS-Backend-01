const jsonWebToken = require('jsonwebtoken');

const jwt = {};
jwt.sign = (object) => jsonWebToken.sign(object, process.env.SECRET);

jwt.decode = (token) => jsonWebToken.decode(token, process.env.SECRET);

jwt.verify = (token) =>
  jsonWebToken.verify(token, process.env.SECRET, (error) => {
    if (error) return false;

    return true;
  });

module.exports = jwt;
