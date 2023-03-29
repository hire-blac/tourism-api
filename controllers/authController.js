require('dotenv').config();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = err => {
  let errors = {email: '', password: ''};

  // duplicate error code
  if (err.code === 11000) {
    errors.email = 'This email is already registered to another user';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({properties}) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

const maxAge = '1h';
const tokenKey = process.env.API_TOKEN_KEY;

// create jwt token
const createToken = id => {
  return jwt.sign({id}, tokenKey, {expiresIn: maxAge});
}

// routes controllers
// register new admin user
module.exports.register = async (req, res) => {
  const {name, email, password} = req.body;
  const user = await Admin.findOne({email});

  if (user) {
    res.status(409).json({
      message: "Email is already registered to existing user"
    });
  } else {
    try {
      const admin = await Admin.create({name, email, password});
      const token = createToken(admin._id);
  
      res.status(201).json({
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email
        },
        message: 'Admin user registration successful',
        accessToken: token
      });
    } 
    catch (err) {
      console.log(err);
      const errors = handleErrors(err);
      // console.log(err);
      res.status(401).json(err);
    }
  }
}

// login admin user
module.exports.login = async (req, res) => {
  const {email, password} = req.body;
  try {
    const admin = await Admin.login(email, password);
    const token = createToken(admin._id);

    res.status(201).json({
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      },
      message: 'Admin user logged in',
      accessToken: token
    });
  } 
  catch (err) {
    res.status(400).json({message: 'invalid login credentials'})
  }
}