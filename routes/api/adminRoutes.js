const { Router } = require('express');
const authController = require('../../controllers/authController');
const bookingControllers = require('../../controllers/bookingControllers');
const userControllers = require('../../controllers/userControllers');

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// booking routes
router.get('/bookings', bookingControllers.allBookings);
router.get('/bookings/:id', bookingControllers.getBooking);

// user routes
router.get('/users', userControllers.allUsers);
router.get('/users/:id', userControllers.single_user);

module.exports = router;