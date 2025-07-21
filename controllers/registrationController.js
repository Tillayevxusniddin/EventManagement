// controllers/registrationController.js
const { Registration, Event, User, Profile } = require('../models');


exports.createRegistration = async (req, res, next) => {
    try {
        const { eventId } = req.body;
        const userId = req.session.userId;

        const event = await Event.findByPk(eventId);
        if (!event || event.status !== 'published' || event.date < new Date()) {
            req.flash('error', 'Bu tadbirga hozir ro\'yxatdan o\'tib bo\'lmaydi.');
            return res.redirect('back');
        }

        if (event.maxAttendees) {
            const currentAttendees = await Registration.count({ where: { eventId } });
            if (currentAttendees >= event.maxAttendees) {
                req.flash('error', 'Afsuski, bu tadbirda bo\'sh o\'rinlar qolmadi.');
                return res.redirect('back');
            }
        }

        const [registration, created] = await Registration.findOrCreate({
            where: { eventId, userId },
            defaults: { eventId, userId }
        });

        if (!created) {
            req.flash('error', 'Siz allaqachon bu tadbirga ro\'yxatdan o\'tgansiz.');
            return res.redirect(`/events/${eventId}`);
        }

        req.flash('success', `Siz "${event.name}" tadbiriga muvaffaqiyatli yozildingiz!`);
        res.redirect(`/events/${eventId}`);

    } catch (error) {
        next(error);
    }
};

exports.cancelRegistration = async (req, res, next) => {
    try {
        const registration = await Registration.findByPk(req.params.registrationId);
        if (!registration) return next();

        if (registration.userId !== req.session.userId) {
            req.flash('error', 'Sizda bu amalni bajarish uchun ruxsat yo\'q.');
            return res.status(403).redirect('back');
        }

        const eventId = registration.eventId;
        await registration.destroy();

        req.flash('success', 'Ro\'yxatdan o\'tishingiz muvaffaqiyatli bekor qilindi.');
        res.redirect(`/events/${eventId}`);
    } catch (error) {
        next(error);
    }
};

exports.showMyRegistrations = async (req, res, next) => {
    try {
        const registrations = await Registration.findAll({
            where: { userId: req.session.userId },
            include: { model: Event, as: 'event' },
            order: [[{ model: Event, as: 'event' }, 'date', 'ASC']]
        });
        
        res.render('registrations/index', {
            title: 'Mening Tadbirlarim',
            registrations: registrations
        });
    } catch (error) {
        next(error);
    }
};

exports.listAttendees = async (req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return next();
        const isOrganizer = event.organizerId === req.session.userId;
        const isAdmin = req.session.role === 'admin';

        if (!isOrganizer && !isAdmin) {
            req.flash('error', 'Sizda bu tadbir ishtirokchilarini ko\'rish uchun ruxsat yo\'q.');
            return res.redirect(`/events/${req.params.id}`);
        }

        const attendees = await Registration.findAll({
            where: { eventId: req.params.id },
            include: { model: User, as: 'user', include: { model: Profile, as: 'profile' } }
        });

        res.render('registrations/attendees', {
            title: `"${event.name}" ishtirokchilari`,
            event: event,
            attendees: attendees
        });
    } catch (error) {
        next(error);
    }
};