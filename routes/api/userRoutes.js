const { Router } = require("express");
const userControllers = require("../../controllers/userControllers");

const router = Router()

router.post('/users/signup', userControllers.userSignup);
router.post('/users/login', userControllers.userLogin);

module.exports = router;