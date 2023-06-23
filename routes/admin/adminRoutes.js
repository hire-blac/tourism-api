const { Router } = require('express');
const cookieParser = require('cookie-parser');
const authController = require('../../controllers/authController');
const bookingControllers = require('../../controllers/bookingControllers');
const { requireAdmin, checkAdmin } = require('../../middlewares/requireAuth');
const adminControllers = require('../../controllers/adminControllers')

const router = Router();

router.use(cookieParser());

const authMiddleware = [requireAdmin, checkAdmin];

router.get('/', authMiddleware, authController.admin_home);

router.route('/v1/register')
  .get(checkAdmin, authController.register_get)
  .post(authController.register);

router.route('/login')
  .get(checkAdmin, authController.login_get)
  .post(authController.login);

router.get('/logout', authController.logout);

// services routes
router.route('/services')
  .get(adminControllers.all_services_get) // get all the services
  .post(adminControllers.new_service); // add a new service

router.get('/services/:slug', adminControllers.service_get);// get a single service

// booking routes
router.get('/bookings', requireAdmin, bookingControllers.allBookings);
router.get('/bookings/completed', requireAdmin, bookingControllers.get_completed);

router.route('/bookings/:id', requireAdmin) 
  .get(bookingControllers.getBooking)
  .post(bookingControllers.booking_set_completed);

// user routes
router.get('/users', adminControllers.allUsers);
router.get('/users/:id', adminControllers.single_user);


module.exports = router;