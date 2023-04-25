const User = require("../models/User");
const jwt_decode = require('jwt-decode');
const bcrypt = require('bcrypt');
const { StatusCodes } = require("http-status-codes");

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

      // Signup new user
      user = await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password
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
