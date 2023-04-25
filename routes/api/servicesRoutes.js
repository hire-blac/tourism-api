const {Router} = require('express');
const servicesController = require('../../controllers/servicesController');

// create router object
const router = Router();

// routes

// get all the services
router.get('/services', servicesController.all_services_get);

// get a single service
router.get('/services/:serviceslug', servicesController.service_get);

// export router object
module.exports = router;