// routes/auth.js

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');


const { validateRegister, validateLogin } = require('../middlewares/validation');
const { isGuest, isAuthenticated } = require('../middlewares/auth');


router.get('/register', isGuest, authController.showRegisterForm);
router.post('/register', isGuest, validateRegister, authController.registerUser);
router.get('/login', isGuest, authController.showLoginForm);
router.post('/login', isGuest, /* validateLogin, */ authController.loginUser); // validateLogin'ni vaqtinchalik o'chirib turamiz
router.post('/logout', isAuthenticated, authController.logoutUser);


module.exports = router;