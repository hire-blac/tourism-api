const { Router } = require("express");
const userControllers = require("../../controllers/userControllers");
const { verifyToken } = require("../../middlewares/requireAuth");

const router = Router()

router.post('/users/signup', userControllers.userSignup);
router.post('/users/login', userControllers.userLogin);
router.get('/users/confirm/:confirmationCode', userControllers.confirmation);


// user profile
router.get('/users/profile', verifyToken, userControllers.userProfile);

module.exports = router;