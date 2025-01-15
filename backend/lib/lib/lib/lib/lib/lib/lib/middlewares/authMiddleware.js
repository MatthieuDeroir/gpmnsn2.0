"use strict";

// middleware/authMiddleware.js
var jwt = require('jsonwebtoken');
exports.authenticate = function (req, res, next) {
  var authHeader = req.headers.authorization;
  var token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({
    message: 'Authentification requise'
  });
  try {
    var payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    res.status(403).json({
      message: 'Jeton invalide'
    });
  }
};