const express = require('express');
const router = express.Router();
const { register, registerAdmin, login, getAllUsers } = require('../controllers/authController');
const { validateRegister } = require("../middleware/validate");
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post("/register", validateRegister, register);
router.post('/login', login);
router.post("/register-admin", validateRegister, registerAdmin);
router.get("/users", protect, restrictTo('admin'), getAllUsers);

module.exports = router;