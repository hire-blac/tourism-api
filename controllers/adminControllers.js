const Booking = require("../models/Bookings");
const User = require("../models/User");
const Service = require("../models/services");

// services controllers
// add new service
module.exports.new_service_get = async (req, res) => {
  res.render('admin/newservice');
}

// create a new service
module.exports.new_service = async (req, res) => {
  const serviceName = req.body['service-name'];
  const description = req.body['description'];

  const service = await Service.create({serviceName, description});
  res.json('/admin/services');
}

// get all services
module.exports.all_services_get = async (req, res) => {
  const services = await Service.find();
  res.render('admin/services', {services});
}

// get a single service
module.exports.service_get = async (req, res) => {
  const slug = req.params.slug
  const service = await Service.findOne(lug);
  res.render('admin/service');
}

// get all users
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