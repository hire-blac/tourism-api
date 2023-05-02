const User = require("../models/User");
const Bookings = require('../models/Bookings')
const jwt_decode = require('jwt-decode');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { StatusCodes } = require("http-status-codes");
const { transporter } = require("../messageHelper");

const sender = process.env.SENDER;
const JWT_SECRET = process.env.API_TOKEN_KEY;

let mailOptions = {
  from: sender, // sender address
  subject: "Email Confirmation", // Subject line
 };


// function to handle Google login
const googleLogin = async (credential) => {
  const decodedUser = jwt_decode(credential);

  let user = await User.findOne({email: decodedUser.email})
  if (!user) {
    user = await User.create({
      firstname: decodedUser.given_name,
      lastname: decodedUser.family_name,
      email: decodedUser.email
    });
  }
  user.email_verified = decodedUser.email_verified;
  return user;
}

// user signup
module.exports.userSignup = async (req, res) => {
  try {

    let user;

    if (req.body.credential) user = await googleLogin(req.body.credential);
    else {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash(req.body.password, salt);
      const emailConfirmationToken = jwt.sign({email: req.body.email}, JWT_SECRET);

      // Signup new user
      user = await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        confirmationCode: emailConfirmationToken,
        password
      });
      const confirmationLink = `/api/users/confirm/${user.confirmationCode}`;
      // set email content
      mailOptions.to = user.email;
      mailOptions.html = `<h1>Email Confirmation</h1>
      <h2>Hello ${user.firstname}</h2>
      <p>Thank you for signing up with Arabianlens. Please confirm your email by clicking on the following link</p>
      <a href="api.arabianlens.com/api/users/confirm/${user.confirmationCode}"> Click here</a>
      </div>`;

      // send email
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
    // return user
    res.status(StatusCodes.CREATED).json(user.toAuthJSON());

  } catch(err) {
    console.log(err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
  }
  
}

// user login
module.exports.userLogin = async (req, res) => {
  try {
    let user;
    if (req.body.credential) user = await googleLogin(req.body.credential);
    else user = await User.login(req.body.email, req.body.password);

    res.status(StatusCodes.OK).json(user.toAuthJSON());
  } catch (err) {
    console.log(err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message);
  }
};

// email confirmation
module.exports.confirmation = async (req, res) => {
  try {
    let user = User.findOne({confirmationCode: req.confirmationCode})
    user.email_verified = true;
    user.save();

    res.status(StatusCodes.OK).render('emailVerified');
  } catch (error) {
    
  }
}
// user profile
module.exports.userProfile = async (req, res) => {
  try {
    const user = req.user;
    const bookings = await Bookings.find({user:user._id}).populate('activity').sort({createdAt: -1})

    res.status(StatusCodes.OK).json({
      user,
      bookings
    });

  } catch (err) {
    console.log(err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message);    
  }
}

  // check token
module.exports.tokenCheck = (req, res) => {
  
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[1]) {
    const token = req.headers.authorization.split(' ')[1];
    
    const decodedToken = jwt.verify(token, JWT_SECRET)
    if (decodedToken) {
      res.json({
        tokenValid: true,
        message: 'Authorization Bearer Token still valid'
      })
    } else {
      res.json({
        tokenValid: false,
        message: 'Authorization Bearer Token not valid'
      })
    }

  } else {
    res.status(403).send({
      message: 'Authorization Bearer Token header is required'
    })
  }
}