// controllers/eventController.js
const { Event, User, Profile, Comment, Registration } = require('../models');
const { Op } = require('sequelize'); 

exports.listEvents = async (req, res, next) => {
    try {
        const events = await Event.findAll({
            where: {
                status: 'published',
                date: { [Op.gte]: new Date() } 
            },
            include: {
                model: User,
                as: 'organizer',
                attributes: ['id', 'username'],
                include: { model: Profile, as: 'profile', attributes: ['firstName', 'lastName'] }
            },
            order: [['date', 'ASC']] 
        });

        res.render('events/index', {
            title: 'Barcha Tadbirlar',
            events: events
        });
    } catch (error) {
        next(error);
    }
};

exports.showEvent = async (req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id, {
            include: [
                { model: User, as: 'organizer', include: { model: Profile, as: 'profile' } },
                {
                    model: Comment,
                    as: 'comments',
                    where: { parentId: null },
                    required: false,
                    include: [
                        { model: User, as: 'user', include: { model: Profile, as: 'profile' } },
                        {
                            model: Comment,
                            as: 'replies',
                            include: { model: User, as: 'user', include: { model: Profile, as: 'profile' } }
                        }
                    ]
                }
            ],
            order: [[{ model: Comment, as: 'comments' }, 'createdAt', 'DESC']]
        });

        if (!event) {
            return res.render('events/show', {
                title: 'Tadbir topilmadi',
                event: null 
            });
        }   

        const isOwner = req.session.userId === event.organizerId;
        const registration = req.session.userId ?
            await Registration.findOne({ where: { eventId: event.id, userId: req.session.userId } }) :
            null;

        // MANA SHU YERDA TUZATISH KIRITILDI:
        // `currentUser` qatori olib tashlandi, chunki u `app.js`dan global tarzda keladi.
        res.render('events/show', {
            title: event.name,
            event: event,
            isOwner: isOwner,
            registration: registration
        });

    } catch (error) {
        next(error);
    }
};

exports.showCreateForm = (req, res) => {
    res.render('events/create', {
        title: 'Yangi Tadbir Yaratish',
        old_input: req.flash('old_input')[0] || {},
    });
};

exports.createEvent = async (req, res, next) => {
    try {
        // Formadan keladigan har bir maydonni alohida o'zgaruvchiga olamiz
        const { name, description, date, location, price, maxAttendees } = req.body;
        let imageUrlPath = null;

         if (req.file) {
            imageUrlPath = '/' + req.file.path.replace(/\\/g, "/").replace("public/", "");
        }

        await Event.create({
            name, description, date, location,
            imageUrl: imageUrlPath, // Saqlangan fayl yo'lini yozamiz
            price: price || 0,
            maxAttendees: maxAttendees || null,
            organizerId: req.session.userId
        });

        req.flash('success', 'Tadbir muvaffaqiyatli yaratildi!');
        res.redirect('/events');

    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            req.flash('error', error.errors.map(e => e.message));
            req.flash('old_input', req.body);
            return res.redirect('/events/new');
        }
        next(error);
    }
};

exports.showEditForm = async (req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return next();

        if (event.organizerId !== req.session.userId) {
            req.flash('error', 'Sizda bu tadbirni tahrirlash uchun ruxsat yo\'q.');
            return res.redirect(`/events/${req.params.id}`);
        }

        res.render('events/edit', { title: `Tahrirlash: ${event.name}`, event: event });
    } catch (error) {
        next(error);
    }
};

exports.updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return next();

        if (event.organizerId !== req.session.userId) {
            req.flash('error', 'Sizda bu amalni bajarish uchun ruxsat yo\'q.');
            return res.redirect(`/events/${req.params.id}`);
        }

        const { name, description, date, location, price, maxAttendees } = req.body;
        let imageUrlPath = event.imageUrl;

        if (req.file) {
            imageUrlPath = '/' + req.file.path.replace(/\\/g, "/").replace("public/", "");
        }

        await event.update({
            name, description, date, location,
            imageUrl: imageUrlPath,
            price: price || 0,
            maxAttendees: maxAttendees || null,
        });

        req.flash('success', 'Tadbir muvaffaqiyatli yangilandi.');
        res.redirect(`/events/${req.params.id}`);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            req.flash('error', error.errors.map(e => e.message));
            req.flash('old_input', req.body);
            return res.redirect(`/events/${req.params.id}/edit`);
        }
        next(error);
    }
};


exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return next();

        if (event.organizerId !== req.session.userId) {
            req.flash('error', 'Sizda bu amalni bajarish uchun ruxsat yo\'q.');
            return res.redirect('/events');
        }

        await event.destroy();
        req.flash('success', 'Tadbir muvaffaqiyatli o\'chirildi.');
        res.redirect('/events');
    } catch (error) {
        next(error);
    }
};