// routes/events.js
const express = require('express');
const router = express.Router();

const eventController = require('../controllers/eventController');
const registrationController = require('../controllers/registrationController');
const { isAuthenticated, isOrganizer } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const { validateEvent } = require('../middlewares/validation');


router.get('/', eventController.listEvents);
router.get('/new', isAuthenticated, isOrganizer, eventController.showCreateForm);
router.post('/',
    isAuthenticated,
    isOrganizer,
    upload.single('eventImage'),
    validateEvent,
    eventController.createEvent
);
router.get('/:id', eventController.showEvent);
router.get('/:id/edit', isAuthenticated, isOrganizer, eventController.showEditForm);

router.get('/:id/registrations', 
    isAuthenticated, 
    isOrganizer, 
    registrationController.listAttendees
);

router.put('/:id',
    isAuthenticated,
    isOrganizer,
    upload.single('eventImage'),
    validateEvent,
    eventController.updateEvent
);
router.delete('/:id',
    isAuthenticated,
    isOrganizer,
    eventController.deleteEvent
);


module.exports = router;