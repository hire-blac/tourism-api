const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const Activity = require('./activity');

mongoose.plugin(slug);

// type of activity schema
const activityTypeSchema = new Schema({
  activityTypeName: {
    type: String,
  },
  image: {
    type: String,
  },
  slug: {
    type: String,
    unique: true,
    slug: 'activityTypeName'
  },
  activities: [{
    type: mongoose.Types.ObjectId,
    ref: Activity
  }]
});

const ActivityType = mongoose.model('activityType', activityTypeSchema);

module.exports = ActivityType;