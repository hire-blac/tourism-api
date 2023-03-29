const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// user model schema
const adminSchema = new Schema({
  firstname: {
    type: String,
    required: [true, 'The firstname field is required']
  },
  lastname: {
    type: String,
    required: [true, 'The lastname field is required']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'The email field is required'],
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'The password field is required'],
    minlength: [6, 'password must be at least 6 characters']
  }
});

// hash password before saving user object
adminSchema.pre('save', async (next)=>{
  if (this.created) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// static method to login user
adminSchema.statics.login = async (email, password)=>{
  const adminUser = await this.findOne({email});
  if(adminUser) {
    const auth = await bcrypt.compare(password, adminUser.password);
    if(auth){
      return adminUser;
    }
    throw Error('Invalid login credentials');
  }
  throw Error('Invalid login credentials');
}

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;