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
adminSchema.pre('save', async function(next){
  if (!this.created) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// static method to login user
adminSchema.statics.login = async function(email, password) {
  const adminUser = await this.findOne({email});
  if(adminUser) {
    const auth = bcrypt.compare(password, adminUser.password);
    if(auth){
      return adminUser;
    }
    throw new Error('Invalid login credentials');
  }
  throw new Error('Invalid login credentials');
}

// static method to login user
// adminSchema.statics.login = async function(email, password){
//   const adminUser = await this.findOne({email});
  
//   if(adminUser) {
//     const auth = await bcrypt.compare(password, adminUser.password);
//     if(auth){
//       return adminUser;
//     }
//     throw Error('Invalid Password');
//   }
//   throw Error('Invalid email');
// }

const Admin = mongoose.model('admin', adminSchema);

module.exports = Admin;