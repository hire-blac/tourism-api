const Service = require("../models/services");

module.exports.all_services_get = async (req, res) => {
  const services = await Service.find();
  res.json(services);
}

module.exports.service_get = async (req, res) => {
  const service = await Service.findOne(req.params.serviceslug);
  res.json(service);
}