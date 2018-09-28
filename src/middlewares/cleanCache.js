"use strict"
const {clearHash} = require('../services/cache');

module.exports = async (req, res, next) => {
  await next(); // Guarantees that the middleware is run at the end of request handler
  clearHash(req.user.id);
}
