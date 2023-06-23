require('dotenv').config();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// handle errors
const handleErrors = err => {
  console.log(err);
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

  console.log(errors);
  return errors;
}

const maxAge = 3 * 24 * 60* 60;
const tokenKey = process.env.API_TOKEN_KEY;

// create jwt token
const createToken = id => {
  return jwt.sign({id}, tokenKey, {expiresIn: maxAge});
}

// routes controllers
module.exports.admin_home = (req, res) => {
  res.render('admin/admin');
}

// register new admin user
module.exports.register_get = (req, res) => {
  res.render('admin/register');
}

module.exports.register = async (req, res) => {
  let {firstname, lastname, email, password} = req.body;

  const admin = await Admin.findOne({email});

  if (admin) {
    res.status(409).json({
      message: "Email is already registered to existing user"
    });
  } else {
    try {

      // const salt = await bcrypt.genSalt();
      // password = await bcrypt.hash(password, salt);

      const admin = await Admin.create({
        firstname, lastname, email, password
      });
      const token = createToken(admin._id);

      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: maxAge * 1000
      })
      res.redirect('/admin');
    }
    catch (error) {
      const err = handleErrors(error);
      console.log(err);
      res.status(401).json(err);
    }
  }
}

// login admin user
module.exports.login_get = (req, res) => {
  res.render('admin/login');
}

module.exports.login = async (req, res) => {
  const {email, password} = req.body;

  try {
    const admin = await Admin.login(email, password);
    const token = createToken(admin._id);

    // res.cookie('jwt', token, {
    //   httpOnly: true,
    //   maxAge: maxAge * 1000
    // })
    res.json({
      firstname: admin.firstname,
      lastname: admin.lastname,
      email: admin.email,
      token: token
    })
    // res.redirect('/admin');
  } 
  catch (err) {
    // console.log(err);
    handleErrors(err);
    res.status(400).send(err)
  }
}

module.exports.logout = (req, res) => {
  res.cookie('jwt', '', {maxAge: 1})
  res.redirect('/admin')
}