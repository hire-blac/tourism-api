require('dotenv').config();
const jwt = require('jsonwebtoken');

const apiTokenKey = process.env.API_TOKEN_KEY;

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

module.exports = verifyToken;