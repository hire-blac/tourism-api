const {Router} = require('express');
const bookingControllers = require('../../controllers/bookingControllers');

// create router object
const router = Router();

// routes

// get all the services
router.get('/bookings', bookingControllers.allBookings);

// create a new activity booking
router.get('/bookings/new', bookingControllers.get_createBooking);
router.post('/bookings/new', bookingControllers.createBooking);

// get a single service
router.get('/bookings/:id', bookingControllers.getBooking);

// export router object
module.exports = router;