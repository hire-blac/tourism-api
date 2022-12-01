const {Router} = require('express');
const servicesController = require('../../controllers/servicesController');

// create router object
const router = Router();

// routes

// get all the services
router.get('/api/services', servicesController.all_services_get);

// add a new service
router.get('/api/services/new', servicesController.new_service_get);
router.post('/api/services/new', servicesController.new_service);

// get a single service
router.get('/api/services/:serviceslug', servicesController.service_get);

// export router object
module.exports = router;