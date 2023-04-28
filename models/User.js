const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const JWT_SECRET = process.env.API_TOKEN_KEY;

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: [true, 'This email is already registered to a user']
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String
  },
  confirmationCode: { 
    type: String, 
    unique: true 
  },
  country: {
    type: String,
  }
}, {timestamps: true});

// user instance methods
userSchema.methods = {
  createToken() {
    return jwt.sign({_id: this._id}, JWT_SECRET, {expiresIn: 60*60*24});
  },
  toAuthJSON() {
    return {
      _id: this.id,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      email_verified: this.email_verified,
      token: this.createToken()
    };
  },
}

// user static methods
userSchema.statics.login = async function(email, password){
  const user = await this.findOne({email: email});
  if(user){
    const valid = await bcrypt.compare(password, user.password);
    if(valid){
      return user;
    }
    throw new Error({message: 'Incorrect password'});
  }
  throw new Error({message: 'User not found'});
}

const User = mongoose.model("User", userSchema);

module.exports = User;