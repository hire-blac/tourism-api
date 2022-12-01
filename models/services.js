const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const serviceSchema =new Schema({
  serviceName: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    slug: 'serviceName'
  },
})

const Service = mongoose.model('service', serviceSchema);

module.exports = Service;