require('dotenv').config();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');


const tokenKey = process.env.API_TOKEN_KEY;

const verifyToken = async (req, res, next) => {
  
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[1]) {
    const token = req.headers.authorization.split(' ')[1];
    
    // console.log(token);
    const decodedToken = jwt.verify(token, tokenKey)
    if (decodedToken) {
      req.user = await User.findById(decodedToken);
      next();
      
    } else {
      console.log(err.message);
      res.status(StatusCodes.FORBIDDEN).json(err.message)
    }

  } else {
    res.status(StatusCodes.FORBIDDEN).send({
      message: 'Authorization Bearer Token header is required'
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