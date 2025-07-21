// routes/registrations.js

const express = require('express');
const router = express.Router();

const registrationController = require('../controllers/registrationController');
const { isAuthenticated} = require('../middlewares/auth');

router.post('/', isAuthenticated, registrationController.createRegistration);
router.delete('/:registrationId', isAuthenticated, registrationController.cancelRegistration);
router.get('/my-registrations', isAuthenticated, registrationController.showMyRegistrations);



module.exports = router;