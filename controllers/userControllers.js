const User = require("../models/User");

module.exports.allUsers = async (req, res) => {
  User.find().sort({updatedAt: -1, _id: -1})
  .then(users => res.json(users))
  .catch(err => res.json(err));
}

// get single user
module.exports.single_user = async (req, res) => {
  User.find()
  .then(user => res.json(user))
  .catch(err => res.json(err));
}