require('dotenv').config();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const tokenKey = process.env.API_TOKEN_KEY;

const verifyToken = (req, res, next) => {
  
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[1]) {
    const token = req.headers.authorization.split(' ')[1];

    try {
      const verifiedToken = jwt.verify(token, apiTokenKey);
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Authentication failed"
      })
    }

  } else {
    res.status(403).send({
      message: 'Authorization header is required'
    })
  }
}

const requireAdmin = (req, res, next) => {
  const token = req.cookies.jwt;

  // check if jwt exists and verify
  if(token) {
    jwt.verify(token, tokenKey, (err, decodedToken) => {
      if(err) {
        console.log(err.message);
        res.redirect('/admin/login');
      }
      else {
        next();
      }
    })
  }
  else {
    res.redirect('/admin/login');
  }
}

// check current user
const checkAdmin = (req, res, next) => {
  const token = req.cookies.jwt;

  // check if jwt exists and verify
  if(token) {
    jwt.verify(token, tokenKey, async (err, decodedToken) => {
      if(err) {
        console.log(err.message);
        res.locals.admin = null;
        next();
      }
      else {
        const admin = await Admin.findById(decodedToken.id);
        res.locals.admin = admin;
        next();
      }
    })
  }
  else {
    res.locals.admin = null;
    next();
  }
}

module.exports = { 
  requireAdmin, 
  checkAdmin, 
  verifyToken 
};