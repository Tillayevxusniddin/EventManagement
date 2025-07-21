const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middlewares/auth');

router.get('/profile', isAuthenticated, userController.showCurrentUserProfile);
router.get('/profile/edit', isAuthenticated, userController.showEditProfileForm);
router.post(
    '/profile/edit',
    isAuthenticated,
    // validateProfile, // Profil ma'lumotlari validatsiyasi
    userController.updateProfile
);
router.get('/users/:id', userController.showUserProfile);


module.exports = router;