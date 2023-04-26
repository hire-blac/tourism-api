const {Router} = require('express');
const bookingControllers = require('../../controllers/bookingControllers');
const { verifyToken } = require('../../middlewares/requireAuth');

// create router object
const router = Router();

// routes

// get all the services
router.get('/bookings', bookingControllers.allBookings);

// create a new activity booking
router.get('/bookings/new', bookingControllers.get_createBooking);
router.post('/bookings/new', verifyToken, bookingControllers.createBooking);

// get a single service
router.get('/bookings/:id', verifyToken, bookingControllers.getBooking);

// export router object
module.exports = router;