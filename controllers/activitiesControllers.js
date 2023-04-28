const ActivityType = require('../models/activityType');
const Activity = require('../models/activity');
const {StatusCodes} = require('http-status-codes');
const Service = require('../models/services');

// function to handle files upload
const handleFiles = async (origin, files) => {
  let imageUrls = [];
  
  // loop over files
  for (const file of files) {
    imageUrls.push(origin + file.path.slice(6));
  }

  return imageUrls;
}

// function to get list of services from db
const getServices = async (serviceList) => {
  const objectList = [];
  if (Array.isArray(serviceList)) {
    for (let serv of serviceList) {
      const service = await Service.findOne({slug: serv})
      if (service) {
        objectList.push(service)
      }
    }
  } else {
    const service = await Service.findOne({slug: serviceList});
    if (service) {
      objectList.push(service)
    }
  }
  
  return objectList;
}

// get all activity types
module.exports.activity_types_get_all = (req, res) => {
  ActivityType.find()
  .then(activityTypes => res.status(StatusCodes.OK).json({activityTypes}))
  .catch(err => res.status(StatusCodes.NO_CONTENT).json(err));
}

// get single activity type
module.exports.activity_type_get = async (req, res) => {
  // get all the activities of a type  
  const activityType = await ActivityType.findOne({slug: req.params['activitytypeslug']}).populate('activities');

  res.status(StatusCodes.OK).json(activityType);
}


module.exports.new_activity_type = (req, res) => {
  res.render('newactivitytype')
}

// add an activity type to database
module.exports.activity_type_post = async (req, res) => {

  const file = req.file;
  const activityTypeName = req.body['activity-type-name']

  const image = req.headers.origin + file.path.slice(6); // remove 'public' from image path

  try {
    const activitytype = await ActivityType.create({
      activityTypeName,
      image
    });
    res.status(StatusCodes.CREATED).json({
      message: "new activity type created",
      activitytype
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }

}

// get single activity
module.exports.single_activity_get = async (req, res) => {
  // get all the activities of a type
  const activity = await Activity.findOne({slug: req.params.activityslug}).populate('services');

  res.status(StatusCodes.OK).json(activity);
}

module.exports.new_single_activity = async (req, res) => {

  const activitytypes = await ActivityType.find();
  const services = await Service.find();

  res.render('newactivity', {activitytypes, services})
}

// add an activity to database
module.exports.single_activity_post = async (req, res) => {

  const origin = req.headers.origin;
  console.log(req.headers);
  const files = req.files;
  const images = await handleFiles(origin, files);

  const activityType = await ActivityType.findOne({slug: req.body['activity-type']});
  
  const activityName = req.body['activity-name'];
  const description = req.body['activity-desc'];
  const servicesIncluded = req.body['services-included'];
  const itenerary = req.body['itenerary'].split(", ");
  const price = req.body['price'];

  const services = await getServices(servicesIncluded);

  try {
    const activity = await Activity.create({
      activityName,
      description,
      itenerary,
      price,
      images
    });
    
    // add services to activity
    services.forEach(service => {
      activity.services.push(service);
    })
    
    activity.save()
    // add activity tp type list
    activityType.activities.push(activity);
    activityType.save();
    
    res.status(StatusCodes.CREATED).json({
      message: "new activity created",
      activity
    })
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
}