const {Router} = require('express');
const activitiesController = require('../../controllers/activitiesControllers');
const multer  = require('multer');

const upload = multer({ dest: 'public/uploads/' });

// create router object
const router = Router();

// routes

// get all the types of activities
router.get('/activity-types', activitiesController.activity_types_get_all);

// add a new type of activity
router.get('/activity-types/new', activitiesController.new_activity_type);
router.post('/activity-types/new', activitiesController.activity_type_post);

// get a single type of activity
router.get('/activity-types/:activitytypeslug', activitiesController.activity_type_get);

// add a new single activity
router.get('/activities/new', activitiesController.new_single_activity);
router.post('/activities/new', upload.single('image'), activitiesController.single_activity_post);

// get a single activity
router.get('/activities/:activityslug', activitiesController.single_activity_get);

// export router object
module.exports = router;