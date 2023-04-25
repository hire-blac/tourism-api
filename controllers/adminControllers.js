const Booking = require("../models/Bookings");
const User = require("../models/User");
const Service = require("../models/services");

// services controllers
// add new service
module.exports.new_service_get = async (req, res) => {
  res.render('admin/newservice');
}

module.exports.new_service = async (req, res) => {
  const serviceName = req.body['service-name'];
  const description = req.body['description'];

  const service = await Service.create({serviceName, description});
  res.json('/admin/services');
}

module.exports.all_services_get = async (req, res) => {
  const services = await Service.find();
  res.render('admin/services', {services});
}

module.exports.service_get = async (req, res) => {
  const slug = req.params.slug
  const service = await Service.findOne(lug);
  res.render('admin/service');
}