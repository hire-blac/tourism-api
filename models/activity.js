const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const Service = require('./services');

mongoose.plugin(slug);

// activity schema
const activitySchema = new Schema({
  activityName: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    slug: 'activityName'
  },
  images: [{
    type: String
  }],
  description: {
    type: String,
    required: true,
  },
  servicesIncluded: [{
    type: mongoose.Types.ObjectId,
    ref: Service
  }],
  itenerary: {
    type: String
  },
  price: {
    type: Number,
    required: true,
  }
}, {timestamps: true});

const Activity = mongoose.model('activity', activitySchema);

module.exports = Activity;