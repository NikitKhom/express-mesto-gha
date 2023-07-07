const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized');

const handleAuthError = (next) => {
  next(new Unauthorized('Необходима авторизация'));
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    handleAuthError(next);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'the-most-secret-secret');
  } catch (err) {
    handleAuthError(next);
  }

  req.user = payload;
  next();
};
